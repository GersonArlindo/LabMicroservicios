const express = require("express");
const cors = require("cors");
const app = express();

// Configurar middlewares
app.use(express.json());
app.use(cors());

// Cargar variables de entorno desde un archivo .env
require("dotenv").config();

// Crear una instancia de la base de datos
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./data/premios.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

// Importar las rutas
const booksRouter = require("../routes/premios/index");

// Registrar las rutas
app.use("/api/v2/premios", booksRouter);

module.exports = app;

