const express = require("express");

const data = require("../../data/datos_perro");

const http = require('http');

const router = express.Router();

const logger = (message) => console.log(`Perros Service: ${message}`);

//GET PERROS
// router.get("/", (req, res) => {
//   const response = {
//     service: "perros",
//     architecture: "microservices",
//     length: data.length,
//     data: data,
//   };
//   logger("Get perros data");
//   return res.send(response);
// });

//Ejercicio 1
router.get("/", (req, res) => {
  const { pais, peso, op } = req.query;
  if (!pais && !peso) {
    return res.status(400).send("Se debe proporcionar al menos un filtro");
  }
  let query = "SELECT * FROM perros";
  const params = [];
  if (pais) {
    query += " WHERE pais_dueno = ?";
    params.push(pais);
  }
  if (peso) {
    if (!op) {
      return res.status(400).send("Se debe proporcionar un operador para el peso");
    }
    const pesoNum = parseFloat(peso);
    if (isNaN(pesoNum)) {
      return res.status(400).send("El peso debe ser un número válido");
    }
    switch (op) {
      case ">":
        query += " WHERE peso > ?";
        break;
      case "<":
        query += " WHERE peso < ?";
        break;
      case ">=":
        query += " WHERE peso >= ?";
        break;
      case "<=":
        query += " WHERE peso <= ?";
        break;
      case "=":
        query += " WHERE peso = ?";
        break;
      default:
        return res.status(400).send("El operador proporcionado no es válido");
    }
    params.push(pesoNum);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error interno del servidor");
    } else {
      res.json(rows);
    }
  });
});


//GET PERRO BY ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const perro = data.find((p) => p.Id == id);
  if (!perro) {
    return res.status(404).send("Perro no encontrado");
  }
  const response = {
    service: "perros",
    architecture: "microservices",
    data: perro,
  };
  logger(`Get perro con id ${id}`);
  return res.send(response);
});


// Exportamos el router
module.exports = router;
