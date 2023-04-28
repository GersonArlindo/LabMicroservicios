const server = require("./src/app");

server.listen(process.env.PORT || 3000, () => {
  console.log(`Microservicio funcionando en el puerto ${process.env.PORT || 3000}`);
});
