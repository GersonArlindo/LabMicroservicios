const express = require("express");

const data = require("../../data/datos_perro");

const http = require('http');

const router = express.Router();

const logger = (message) => console.log(`Perros Service: ${message}`);

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

// Exportamos el router
module.exports = router;
