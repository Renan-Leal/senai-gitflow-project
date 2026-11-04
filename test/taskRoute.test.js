const request = require("supertest");

jest.mock("../src/services/taskService");

const service = require("../src/services/taskService");
const app = require("../src/app");

const NOT_FOUND = "Tarefa não encontrada.";
const TASK = { id: 1, title: "Tarefa", completed: false, isDeleted: false };

describe("Rotas de tarefas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("GET /tasks/:id deve retornar a tarefa", async () => {
    service.getTask.mockResolvedValue(TASK);

    const response = await request(app).get("/tasks/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(TASK);
    expect(service.getTask).toHaveBeenCalledWith(1);
  });

  test("GET /tasks/:id deve retornar 404 quando não existe", async () => {
    service.getTask.mockRejectedValue(new Error(NOT_FOUND));

    const response = await request(app).get("/tasks/99");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: NOT_FOUND });
  });

  test("GET /tasks deve retornar 500 em erro inesperado", async () => {
    service.listTasks.mockRejectedValue(new Error("falha de banco"));

    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Erro interno do servidor." });
    expect(console.error).toHaveBeenCalled();
  });

  test("POST /tasks deve retornar 400 sem título", async () => {
    service.createTask.mockRejectedValue(
      new Error("O título da tarefa é obrigatório.")
    );

    const response = await request(app).post("/tasks").send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: "O título da tarefa é obrigatório."
    });
  });

  test("PUT /tasks/:id deve atualizar a tarefa", async () => {
    service.updateTask.mockResolvedValue({ ...TASK, title: "Nova" });

    const response = await request(app)
      .put("/tasks/1")
      .send({ title: "Nova" });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Nova");
    expect(service.updateTask).toHaveBeenCalledWith(1, "Nova");
  });

  test("PUT /tasks/:id deve retornar 404 quando não existe", async () => {
    service.updateTask.mockRejectedValue(new Error(NOT_FOUND));

    const response = await request(app)
      .put("/tasks/99")
      .send({ title: "Nova" });

    expect(response.statusCode).toBe(404);
  });

  test("PUT /tasks/:id deve retornar 500 em erro inesperado", async () => {
    service.updateTask.mockRejectedValue(new Error("boom"));

    const response = await request(app)
      .put("/tasks/1")
      .send({ title: "Nova" });

    expect(response.statusCode).toBe(500);
  });

  test("PATCH /tasks/:id/complete deve concluir a tarefa", async () => {
    service.completeTask.mockResolvedValue({ ...TASK, completed: true });

    const response = await request(app).patch("/tasks/1/complete");

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toBe(true);
    expect(service.completeTask).toHaveBeenCalledWith(1);
  });

  test("PATCH /tasks/:id/complete deve retornar 404 quando não existe", async () => {
    service.completeTask.mockRejectedValue(new Error(NOT_FOUND));

    const response = await request(app).patch("/tasks/99/complete");

    expect(response.statusCode).toBe(404);
  });

  test("PATCH /tasks/:id/reopen deve reabrir a tarefa", async () => {
    service.reopenTask.mockResolvedValue(TASK);

    const response = await request(app).patch("/tasks/1/reopen");

    expect(response.statusCode).toBe(200);
    expect(service.reopenTask).toHaveBeenCalledWith(1);
  });

  test("PATCH /tasks/:id/reopen deve retornar 404 quando não existe", async () => {
    service.reopenTask.mockRejectedValue(new Error(NOT_FOUND));

    const response = await request(app).patch("/tasks/99/reopen");

    expect(response.statusCode).toBe(404);
  });

  test("DELETE /tasks/:id deve remover a tarefa", async () => {
    service.deleteTask.mockResolvedValue({ ...TASK, isDeleted: true });

    const response = await request(app).delete("/tasks/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.isDeleted).toBe(true);
    expect(service.deleteTask).toHaveBeenCalledWith(1);
  });

  test("DELETE /tasks/:id deve retornar 404 quando não existe", async () => {
    service.deleteTask.mockRejectedValue(new Error(NOT_FOUND));

    const response = await request(app).delete("/tasks/99");

    expect(response.statusCode).toBe(404);
  });
});
