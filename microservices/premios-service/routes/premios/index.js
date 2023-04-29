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

//Ejercicio 2

router.get("/promedio-premios/:lugar", (req, res) => {
  const lugar = req.params.lugar;
  db.get("SELECT AVG(premio) as promedio_premio FROM campeonatos WHERE lugar = ?", [lugar], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error interno del servidor");
    } else {
      res.json(row);
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
        .get(`http://localhost:4000/api/v2/perros/ById/${id_campeon}`)
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



// Ej 4

function generarConsultaSQL(puntaje) {
  const cantidadAsteriscos = puntaje / 10; // Dividimos por 10 para obtener la cantidad de asteriscos que se están buscando
  const asteriscos = "*".repeat(cantidadAsteriscos); // Creamos una cadena de texto con la cantidad exacta de asteriscos
  return `SELECT pais_competencia FROM campeonatos WHERE puntaje LIKE '${asteriscos}'`;
}

router.get("/puntaje/:puntaje", async (req, res) => {
  const puntaje = parseInt(req.params.puntaje);
  if (isNaN(puntaje) || puntaje < 10 || puntaje > 50 || puntaje % 10 !== 0) {
    res.status(400).send("El puntaje ingresado no es válido.");
    return;
  }

  const consultaSQL = generarConsultaSQL(puntaje);

  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(consultaSQL, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject("Error interno del servidor");
        } else {
          resolve(rows);
        }
      });
    });

    const razasPorPais = await Promise.all(
      rows.map(async (row) => {
        const pais = row.pais_competencia;
        const response = await fetch(`http://localhost:5000/api/v2/razas/razas-por-pais/${pais}`);
        const json = await response.json();
        const razas = json.map(({ raza }) => raza);
        const perrosPorRaza = await Promise.all(
          razas.map(async (raza) => {
            const response = await fetch(`http://localhost:4000/api/v2/perros/perrosPorRaza/${raza}`);
            const json = await response.json();
            return { raza, perros: json };
          })
        );
        return { pais, perrosPorRaza };
      })
    );

    res.json(razasPorPais);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});


// function generarConsultaSQL(puntaje) {
//   const cantidadAsteriscos = puntaje / 10; // Dividimos por 10 para obtener la cantidad de asteriscos que se están buscando
//   const asteriscos = "*".repeat(cantidadAsteriscos); // Creamos una cadena de texto con la cantidad exacta de asteriscos
//   return `SELECT pais_competencia FROM campeonatos WHERE puntaje LIKE '${asteriscos}'`;
// }

// router.get("/puntaje/:puntaje", async (req, res) => {
//   const puntaje = parseInt(req.params.puntaje);
//   if (isNaN(puntaje) || puntaje < 10 || puntaje > 50 || puntaje % 10 !== 0) {
//     res.status(400).send("El puntaje ingresado no es válido.");
//     return;
//   }

//   const consultaSQL = generarConsultaSQL(puntaje);

//   try {
//     const rows = await new Promise((resolve, reject) => {
//       db.all(consultaSQL, (err, rows) => {
//         if (err) {
//           console.error(err.message);
//           reject("Error interno del servidor");
//         } else {
//           resolve(rows);
//         }
//       });
//     });

//     const razasPorPais = await Promise.all(
//       rows.map(async (row) => {
//         const pais = row.pais_competencia;
//         const response = await fetch(`http://localhost:5000/api/v2/razas/razas-por-pais/${pais}`);
//         const json = await response.json();
//         return { pais, razas: json };
//       })
//     );

//     res.json(razasPorPais);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error interno del servidor");
//   }
// });







module.exports = router;
