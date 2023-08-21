const express = require("express");
const app = express();
const cafes = require("./cafes.json");

app.listen(3000, console.log("SERVIDOR ENCENDIDO"));
app.use(express.json());
app.get("/cafes", (req, res) => {
  res.status(200).send(cafes);
});
app.get("/cafes/:id", (req, res) => {
  const { id } = req.params;
  const cafe = cafes.find((c) => c.id == id);
  if (cafe) {
    res.status(200).send(cafe);
  } else {
    res.status(404).send({ message: "NO SE ENCONTRÓ ESE CAFE" });
  }
});

app.post("/cafes", (req, res) => {
  const cafe = req.body;
  const { id } = cafe;
  const existeUnCafeConEseId = cafes.some((c) => c.id === id);
  if (existeUnCafeConEseId) {
    res.status(400).send({ message: "YA EXISTE ESE CAFE" });
  } else {
    cafes.push(cafe);
    res.status(201).send(cafes);
  }
});

app.put("/cafes/:id", (req, res) => {
  const cafe = req.body;
  const { id } = req.params;
  if (id != cafe.id) {
    return res.status(400).send({
      message: "ELCAFE SOLICITADO NO COINCIDE CON EL PEDIDO",
    });
  }
  const cafeIndexFound = cafes.findIndex((p) => p.id === id);

  if (cafeIndexFound >= 0) {
    cafes[cafeIndexFound] = cafe;
    res.send(cafes);
  } else {
    res.status(404).send({ message: "NO SE ENCONTRÓ NINGÚNN CAFÉ" });
  }
});

app.delete("/cafes/:id", (req, res) => {
  const jwt = req.header("Authorization");
  if (jwt) {
    const { id } = req.params;
    const cafeIndexFound = cafes.findIndex((c) => c.id === id);
    if (cafeIndexFound >= 0) {
      cafes.splice(cafeIndexFound, 1);
      console.log(cafeIndexFound, cafes);
      res.send(cafes);
    } else {
      res.status(404).send({ message: "NO SE ENCONTRÓ NINGÚN CAFE" });
    }
  } else {
    res
      .status(400)
      .send({
        message: "NO RECIBIÓ NINGÚN TOKEN EN LAS CABECERAS (Authorization)",
      });
  }
});
app.use("*", (req, res) => {
  res.status(404).send({ message: "LA RUTA QUE INTENTA CONSULTAR NO EXISTE" });
});

module.exports = app;
