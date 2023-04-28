const express = require("express");

const http = require('http');

const router = express.Router();

const logger = (message) => console.log(`Razas Service: ${message}`);

const fs = require("fs");
const csv = require("csv-parser");
const URL_CSV = "./data/raza_info.csv";

//Funcion encargada de parsear mi archivo y me retorna una promesa para poder hacer uso de ella en cualquier lugar
function convertCSVToJSON(csvFilePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(JSON.stringify(results));
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Ejemplo de uso
convertCSVToJSON(URL_CSV)
  .then((json) => { 
    router.get("/", (req, res) => {
      logger("Get razas data");
      return res.send(json);
    });
  })
  .catch((error) => {
    console.error(error);
  });

// Exportamos el router
module.exports = router;
