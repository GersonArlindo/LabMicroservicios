const express = require("express");

const data = require("../../data/datos_perro");

const http = require('http');

const router = express.Router();

const logger = (message) => console.log(`Perros Service: ${message}`);

//GET PERROS
router.get("/", (req, res) => {
  const response = {
    service: "perros",
    architecture: "microservices",
    length: data.length,
    data: data,
  };
  logger("Get perros data");
  return res.send(response);
});

//Ejercicio 1
// router.get("/ByPaisPeso/:pais/:peso", (req, res) => {
//   const pais = req.params.pais;
//   const peso = req.params.peso;
  
//   // Validar el peso
//   let pesoOperator = "";
//   let pesoValue = "";
//   if (peso.includes(">=")) {
//     pesoOperator = ">=";
//     pesoValue = peso.replace(">=", "");
//   } else if (peso.includes("<=")) {
//     pesoOperator = "<=";
//     pesoValue = peso.replace("<=", "");
//   } else if (peso.includes(">")) {
//     pesoOperator = ">";
//     pesoValue = peso.replace(">", "");
//   } else if (peso.includes("<")) {
//     pesoOperator = "<";
//     pesoValue = peso.replace("<", "");
//   } else if (peso.includes("=")) {
//     pesoOperator = "=";
//     pesoValue = peso.replace("=", "");
//   } else {
//     res.status(400).send("El valor de peso no es válido");
//     return;
//   }
  
//   // Validar el país
//   const query = `SELECT * FROM perros WHERE pais_dueno = ? AND peso ${pesoOperator} ?`;
//   db.all(query, [pais, pesoValue], (err, rows) => {
//     if (err) {
//       console.error(err.message);
//       res.status(500).send("Error interno del servidor");
//     } else {
//       res.json(rows);
//     }
//   });
// });



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
