const express = require("express");
const axios = require('axios');
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

// Crear una instancia de la base de datos
const db = new sqlite3.Database("./data/premios.db");

// Ruta para obtener todos los libros
router.get("/", (req, res) => {
  db.all("SELECT * FROM campeonatos", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error interno del servidor");
    } else {
      res.json(rows);
    }
  });
}); 

//Ejercicio 3
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM campeonatos WHERE id = ?";
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error interno del servidor");
    } else if (!row) {
      res.status(404).send("Campeonato no encontrado");
    } else {
      // Obtener id_campeon del objeto row
      const id_campeon = row.id_campeon;
      
      // Hacer la solicitud a la API de perros usando el id_campeon
      axios
        .get(`http://localhost:4000/api/v2/perros/${id_campeon}`)
        .then(response => {
          // Combinando
          const data = {
            id: row.id,
            id_campeon: row.id_campeon,
            anio_campeonato: row.anio_campeonato,
            lugar: row.lugar,
            categoria_ganada: row.categoria_ganada,
            pais_competencia: row.pais_competencia,
            premio: row.premio,
            puntaje: row.puntaje,
            perro: response.data.data
          };
          res.json(data);
        })
        .catch(error => {
          console.error(error);
          res.status(500).send("Error interno del servidor");
        });
    }
  });
});

// router.get("/:id", (req, res) => {
//   const id = req.params.id;
//   const query = "SELECT * FROM campeonatos WHERE id = ?";
//   db.get(query, [id], (err, row) => {
//     if (err) {
//       console.error(err.message);
//       res.status(500).send("Error interno del servidor");
//     } else if (!row) {
//       res.status(404).send("Campeonato no encontrado");
//     } else {
//       res.json(row);
//     }
//   });
// });

// router.get("/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   if (isNaN(id)) {
//     res.status(400).send("El id ingresado no es válido.");
//     return;
//   }
//   db.get("SELECT * FROM campeonatos WHERE id = ?", [id], (err, row) => {
//     if (err) {
//       console.error(err.message);
//       res.status(500).send("Error interno del servidor");
//       return;
//     }
//     if (!row) {
//       res.status(404).send("El campeonato no existe.");
//       return;
//     }
//     const idCampeon = row.id_campeon;
//     axios
//       .get(`http://localhost:4000/api/v2/perros/${idCampeon}`)
//       .then((response) => {
//         const perro = response.data.data;
//         res.json({
//           id: id,
//           id_campeon: idCampeon,
//           perro: perro,
//         });
//       })
//       .catch((error) => {
//         console.error(error);
//         res.status(500).send("Error al obtener los detalles del perro.");
//       });
//   });
// });




function generarConsultaSQL(puntaje) {
  const cantidadAsteriscos = puntaje / 10; // Dividimos por 10 para obtener la cantidad de asteriscos que se están buscando
  const asteriscos = "*".repeat(cantidadAsteriscos); // Creamos una cadena de texto con la cantidad exacta de asteriscos
  return `SELECT id_campeon FROM campeonatos WHERE puntaje LIKE '${asteriscos}'`;
}

router.get("/:puntaje", (req, res) => {
  const puntaje = parseInt(req.params.puntaje);
  if (isNaN(puntaje) || puntaje < 10 || puntaje > 50 || puntaje % 10 !== 0) {
    res.status(400).send("El puntaje ingresado no es válido.");
    return;
  }
  const consultaSQL = generarConsultaSQL(puntaje);
  db.all(consultaSQL, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error interno del servidor");
    } else {
      const id_campeones = rows.map(row => row.id_campeon);
      const perrosPromises = id_campeones.map(id_campeon => axios.get(`http://localhost:4000/api/v2/perros/${id_campeon}`));
      Promise.all(perrosPromises)
        .then(responses => {
          const perrosData = responses.map(response => response.data);
          const response = {
            service: "premios",
            architecture: "microservices",
            puntaje: puntaje,
            perrosData: perrosData,
          };
          res.json(response);
        })
        .catch(error => {
          console.error(error);
          res.status(500).send("Error al obtener los datos de los perros");
        });
    }
  });
});


/* router.get("/:puntaje", (req, res) => {
  const puntaje = parseInt(req.params.puntaje);
  if (isNaN(puntaje) || puntaje < 10 || puntaje > 50 || puntaje % 10 !== 0) {
    res.status(400).send("El puntaje ingresado no es válido.");
    return;
  }
  const consultaSQL = generarConsultaSQL(puntaje);
  db.all(consultaSQL, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error interno del servidor");
    } else {
      res.json(rows);
    }
  });
}); */


// Función que devuelve la consulta SQL según el número ingresado
// function generarConsultaSQL(numero) {
//   let puntajeCondicion = "";
//   switch (numero) {
//     case 10:
//       puntajeCondicion = "WHERE puntaje = '*'";
//       break;
//     case 20:
//       puntajeCondicion = "WHERE puntaje = '**'";
//       break;
//     case 30:
//       puntajeCondicion = "WHERE puntaje = '***'";
//       break;
//     case 40:
//       puntajeCondicion = "WHERE puntaje = '****'";
//       break;
//     case 50:
//       puntajeCondicion = "WHERE puntaje = '*****'";
//       break;
//     default:
//       break;
//   }
//   return `SELECT premio FROM campeonatos ${puntajeCondicion}`;
// }

// // Endpoint refactorizado con variables más descriptivas
// router.get("/:puntaje", (req, res) => {
//   const puntaje = req.params.puntaje;
//   const consultaSQL = generarConsultaSQL(puntaje);

//   db.all(consultaSQL, (err, rows) => {
//     if (err) {
//       console.error(err.message);
//       res.status(500).send("Error interno del servidor");
//     } else {
//       res.json(rows);
//     }
//   });
// });



module.exports = router;
