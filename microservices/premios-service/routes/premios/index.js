const express = require("express");
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
module.exports = router;
