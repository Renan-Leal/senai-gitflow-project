
const request = require("supertest");

jest.mock("../src/services/taskService");

const service = require("../src/services/taskService");
const app = require("../src/app");

describe("API de tarefas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET / deve retornar mensagem da API", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "API de tarefas funcionando."
    });
  });

  test("GET /tasks deve retornar lista de tarefas", async () => {
    service.listTasks.mockResolvedValue([]);

    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("POST /tasks deve criar uma tarefa", async () => {
    service.createTask.mockResolvedValue({
      id: 1,
      title: "Estudar Node.js",
      completed: false,
      isDeleted: false
    });

    const response = await request(app)
      .post("/tasks")
      .send({ title: "Estudar Node.js" });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      title: "Estudar Node.js",
      completed: false,
      isDeleted: false
    });

    expect(service.createTask).toHaveBeenCalledWith("Estudar Node.js");
  });

  test("POST /tasks deve rejeitar título vazio", async () => {
    service.createTask.mockRejectedValue(
      new Error("O título da tarefa é obrigatório.")
    );

    const response = await request(app)
      .post("/tasks")
      .send({ title: "" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: "O título da tarefa é obrigatório."
    });
  });

  test("GET /tasks/:id deve retornar tarefa existente", async () => {
    service.getTask.mockResolvedValue({
      id: 1,
      title: "Minha tarefa",
      completed: false,
      isDeleted: false
    });

    const response = await request(app).get("/tasks/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Minha tarefa");
  });

  test("GET /tasks/:id deve retornar 404 para tarefa inexistente", async () => {
    service.getTask.mockRejectedValue(
      new Error("Tarefa não encontrada.")
    );

    const response = await request(app).get("/tasks/999");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: "Tarefa não encontrada."
    });
  });

  test("PUT /tasks/:id deve atualizar uma tarefa", async () => {
    service.updateTask.mockResolvedValue({
      id: 1,
      title: "Título novo",
      completed: false,
      isDeleted: false
    });

    const response = await request(app)
      .put("/tasks/1")
      .send({ title: "Título novo" });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Título novo");
  });

  test("PATCH /tasks/:id/complete deve concluir tarefa", async () => {
    service.completeTask.mockResolvedValue({
      id: 1,
      title: "Tarefa",
      completed: true,
      isDeleted: false
    });

    const response = await request(app).patch("/tasks/1/complete");

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  test("PATCH /tasks/:id/reopen deve reabrir tarefa", async () => {
    service.reopenTask.mockResolvedValue({
      id: 1,
      title: "Tarefa",
      completed: false,
      isDeleted: false
    });

    const response = await request(app).patch("/tasks/1/reopen");

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(false);
  });

  test("DELETE /tasks/:id deve excluir logicamente uma tarefa", async () => {
    service.deleteTask.mockResolvedValue({
      id: 1,
      title: "Excluir",
      completed: false,
      isDeleted: true
    });

    const response = await request(app).delete("/tasks/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.isDeleted).toBe(true);
  });

  test("rota inexistente deve retornar 404", async () => {
    const response = await request(app).get("/qualquer-coisa");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: "Rota não encontrada."
    });
  });
});
