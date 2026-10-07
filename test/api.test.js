const request = require("supertest");
const app = require("../src/app");

describe("API de tarefas", () => {
  beforeEach(() => {
    const TodoList = require("../src");
    const todoList = new TodoList();

    app.locals.todoList = todoList;
  });

  test("GET / deve retornar mensagem da API", async () => {
    const response = await request(app)
      .get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "API de tarefas funcionando."
    });
  });

  test("GET /tasks deve retornar lista de tarefas", async () => {
    const response = await request(app)
      .get("/tasks");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /tasks deve criar uma tarefa", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({
        title: "Estudar Node.js"
      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      title: "Estudar Node.js",
      completed: false,
      isDeleted: false
    });
  });

  test("POST /tasks deve rejeitar título vazio", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({
        title: ""
      });

    expect(response.statusCode).toBe(400);

    expect(response.body).toEqual({
      error: "O título da tarefa é obrigatório."
    });
  });

  test("PUT /tasks/:id deve atualizar uma tarefa", async () => {
    await request(app)
      .post("/tasks")
      .send({
        title: "Título antigo"
      });

    const response = await request(app)
      .put("/tasks/1")
      .send({
        title: "Título novo"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Título novo");
  });

  test("PATCH /tasks/:id/complete deve concluir tarefa", async () => {
    await request(app)
      .post("/tasks")
      .send({
        title: "Tarefa"
      });

    const response = await request(app)
      .patch("/tasks/1/complete");

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  test("PATCH /tasks/:id/reopen deve reabrir tarefa", async () => {
    await request(app)
      .post("/tasks")
      .send({
        title: "Tarefa"
      });

    await request(app)
      .patch("/tasks/1/complete");

    const response = await request(app)
      .patch("/tasks/1/reopen");

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(false);
  });

  test("DELETE /tasks/:id deve excluir logicamente uma tarefa", async () => {
    await request(app)
      .post("/tasks")
      .send({
        title: "Excluir"
      });

    const response = await request(app)
      .delete("/tasks/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.isDeleted).toBe(true);

    const tasksResponse = await request(app)
      .get("/tasks");

    expect(tasksResponse.body).toEqual([]);
  });

  test("GET /tasks/:id deve retornar tarefa existente", async () => {
    await request(app)
      .post("/tasks")
      .send({
        title: "Minha tarefa"
      });

    const response = await request(app)
      .get("/tasks/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Minha tarefa");
  });

  test("GET /tasks/:id deve retornar 404 para tarefa inexistente", async () => {
    const response = await request(app)
      .get("/tasks/999");

    expect(response.statusCode).toBe(404);

    expect(response.body).toEqual({
      error: "Tarefa não encontrada."
    });
  });

  test("rota inexistente deve retornar 404", async () => {
    const response = await request(app)
      .get("/qualquer-coisa");

    expect(response.statusCode).toBe(404);

    expect(response.body).toEqual({
      error: "Rota não encontrada."
    });
  });
});

test("PUT /tasks/:id deve retornar 404 quando a tarefa não existe", async () => {
  const response = await request(app)
    .put("/tasks/999")
    .send({
      title: "Novo título"
    });

  expect(response.statusCode).toBe(404);

  expect(response.body).toEqual({
    error: "Tarefa não encontrada."
  });
});

test("PUT /tasks/:id deve retornar 400 quando o título é inválido", async () => {
  await request(app)
    .post("/tasks")
    .send({
      title: "Tarefa"
    });

  const response = await request(app)
    .put("/tasks/1")
    .send({
      title: ""
    });

  expect(response.statusCode).toBe(400);

  expect(response.body).toEqual({
    error: "O título da tarefa é obrigatório."
  });
});

test("PATCH /tasks/:id/complete deve retornar 404 quando a tarefa não existe", async () => {
  const response = await request(app)
    .patch("/tasks/999/complete");

  expect(response.statusCode).toBe(404);

  expect(response.body).toEqual({
    error: "Tarefa não encontrada."
  });
});

test("PATCH /tasks/:id/reopen deve retornar 404 quando a tarefa não existe", async () => {
  const response = await request(app)
    .patch("/tasks/999/reopen");

  expect(response.statusCode).toBe(404);

  expect(response.body).toEqual({
    error: "Tarefa não encontrada."
  });
});

test("DELETE /tasks/:id deve retornar 404 quando a tarefa não existe", async () => {
  const response = await request(app)
    .delete("/tasks/999");

  expect(response.statusCode).toBe(404);

  expect(response.body).toEqual({
    error: "Tarefa não encontrada."
  });
});