const express = require("express");

const locations = require("../routes/razas");

const app = express();

app.use("/api/v2/razas", locations);

module.exports = app;

/* 
Este código define una aplicación Express que utiliza el módulo razas para gestionar las rutas para las ubicaciones en la versión 2 de la API en la ruta /api/v2/countries. El módulo locations debe exportar un objeto Router que define las rutas y los controladores para las operaciones de gestión de ubicaciones.
*/
