const request = require("supertest");
const server = require("../index");

describe("GET /cafes", () => {
  it("Debe devolver un código de estado 200 y un arreglo (array) con al menos 1 objeto", async () => {
    const response = await request(server).get("/cafes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe("DELETE /cafes/:id", () => {
  it("DEBE DEVOLVER UN CÓDIGO DE ESTADO 404 (NO ENCONTRADO) AL INTENTAR ELIMINAR UN CAFÉ CON UNA ID QUE NO EXISTE", async () => {
    const response = await request(server)
      .delete(`/cafes/${16}`)
      .set("Authorization", "Bearer my-valid-token");
    expect(response.status).toBe(404);
  });
});

describe("POST /cafes", () => {
  it("DEBE AGREGAR UN NUEVO CAFÉ Y DEVOLVER UN CÓDIGO DE ESTADO 201 (CREADO)", async () => {
    const newCafe = {
      id: 5,
      nombre: "LATTE VAINILLA",
    };
    const response = await request(server).post("/cafes").send(newCafe);
    expect(response.status).toBe(201);
    const getCafesResponse = await request(server).get("/cafes");
    const cafeIds = getCafesResponse.body.map((cafe) => cafe.id);
    expect(cafeIds).toContain(newCafe.id);
  });
});

describe("PUT /cafes/:id", () => {
  it("DEBE DEVOLVER UN CÓDIGO DE ESTADO 400 SI INTENTA ACTUALIZAR UN CAFÉ CON ID'S INCORRECTOS", async () => {
    const cafeUpdate = {
      id: 1,
      nombre: "MAL CORTADO",
    };
    const response = await request(server)
      .put(`/cafes/${cafeUpdate.id + 1}`)
      .send(cafeUpdate);
    expect(response.status).toBe(400);
  });
});
