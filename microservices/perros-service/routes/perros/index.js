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

router.get("/:pais/:condicion/:valor", (req, res) => {
  const { pais, condicion, valor } = req.params;
  const filteredData = data.filter((perro) => {
    if (perro.pais_dueno !== pais) return false;
    switch (condicion) {
      case ">":
        return perro.peso > valor;
      case ">=":
        return perro.peso >= valor;
      case "<":
        return perro.peso < valor;
      case "<=":
        return perro.peso <= valor;
      case "=":
        return perro.peso == valor;
      default:
        return false;
    }
  });
  const response = {
    service: "perros",
    architecture: "microservices",
    length: filteredData.length,
    data: filteredData,
  };
  logger(`Get perros data filtrada por pais=${pais} y peso ${condicion} ${valor}`);
  return res.send(response);
});


//GET PERRO BY ID
router.get("/ById/:id", (req, res) => {
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

//GET PERROS BY RAZA
router.get("/perrosPorRaza/:raza", (req, res) => {
  const raza = req.params.raza;
  const perros = data.filter((p) => p.raza === raza);
  if (perros.length === 0) {
    return res.status(404).send("Perros no encontrados");
  }
  const response = {
    service: "perros",
    architecture: "microservices",
    data: perros,
  };
  logger(`Get perros con raza ${raza}`);
  return res.send(response);
});



// Exportamos el router
module.exports = router;
