
jest.mock("../src/repositories/taskRepository");

const repository = require("../src/repositories/taskRepository");
const service = require("../src/services/taskService");

describe("TaskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve listar tarefas", async () => {
    repository.findAll.mockResolvedValue([]);

    await expect(service.listTasks()).resolves.toEqual([]);
    expect(repository.findAll).toHaveBeenCalled();
  });

  test("deve criar tarefa com título normalizado", async () => {
    repository.create.mockResolvedValue({
      id: 1,
      title: "Estudar Docker",
      completed: false,
      isDeleted: false
    });

    const task = await service.createTask("  Estudar Docker  ");

    expect(repository.create).toHaveBeenCalledWith("Estudar Docker");
    expect(task.title).toBe("Estudar Docker");
  });

  test("deve rejeitar título vazio", async () => {
    await expect(service.createTask("")).rejects.toThrow(
      "O título da tarefa é obrigatório."
    );

    expect(repository.create).not.toHaveBeenCalled();
  });

  test("deve rejeitar título não textual", async () => {
    await expect(service.createTask(null)).rejects.toThrow(
      "O título da tarefa é obrigatório."
    );
  });

  test("deve retornar tarefa existente", async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      title: "Tarefa",
      completed: false,
      isDeleted: false
    });

    await expect(service.getTask(1)).resolves.toMatchObject({
      id: 1,
      title: "Tarefa"
    });
  });

  test("deve lançar erro quando a tarefa não existe", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getTask(999)).rejects.toThrow(
      "Tarefa não encontrada."
    );
  });

  test("deve concluir uma tarefa existente", async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      title: "Tarefa",
      completed: false,
      isDeleted: false
    });

    repository.setCompleted.mockResolvedValue({
      id: 1,
      title: "Tarefa",
      completed: true,
      isDeleted: false
    });

    const task = await service.completeTask(1);

    expect(repository.setCompleted).toHaveBeenCalledWith(1, true);
    expect(task.completed).toBe(true);
  });

  test("deve excluir logicamente uma tarefa", async () => {
    repository.findById.mockResolvedValue({
      id: 1,
      title: "Tarefa",
      completed: false,
      isDeleted: false
    });

    repository.softDelete.mockResolvedValue(undefined);

    const task = await service.deleteTask(1);

    expect(repository.softDelete).toHaveBeenCalledWith(1);
    expect(task.isDeleted).toBe(true);
  });
});
