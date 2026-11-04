jest.mock("../src/repositories/taskRepository");

const repository = require("../src/repositories/taskRepository");
const service = require("../src/services/taskService");

const TASK = { id: 1, title: "Tarefa", completed: false, isDeleted: false };

describe("TaskService - casos de atualização e erro", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getTask deve lançar erro quando a tarefa não existe", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getTask(99)).rejects.toThrow(
      "Tarefa não encontrada."
    );
  });

  test("createTask deve rejeitar título vazio", async () => {
    await expect(service.createTask("   ")).rejects.toThrow(
      "O título da tarefa é obrigatório."
    );
    await expect(service.createTask(123)).rejects.toThrow(
      "O título da tarefa é obrigatório."
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  test("updateTask deve validar, verificar existência e atualizar com título normalizado", async () => {
    repository.findById.mockResolvedValue(TASK);
    repository.update.mockResolvedValue({ ...TASK, title: "Nova" });

    await expect(service.updateTask(1, "  Nova  ")).resolves.toEqual({
      ...TASK,
      title: "Nova"
    });
    expect(repository.update).toHaveBeenCalledWith(1, "Nova");
  });

  test("updateTask deve rejeitar título inválido antes de buscar", async () => {
    await expect(service.updateTask(1, "")).rejects.toThrow(
      "O título da tarefa é obrigatório."
    );
    expect(repository.findById).not.toHaveBeenCalled();
  });

  test("updateTask deve lançar erro quando a tarefa não existe", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.updateTask(99, "Nova")).rejects.toThrow(
      "Tarefa não encontrada."
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  test("reopenTask deve marcar a tarefa como não concluída", async () => {
    repository.findById.mockResolvedValue({ ...TASK, completed: true });
    repository.setCompleted.mockResolvedValue(TASK);

    await expect(service.reopenTask(1)).resolves.toEqual(TASK);
    expect(repository.setCompleted).toHaveBeenCalledWith(1, false);
  });

  test("reopenTask deve lançar erro quando a tarefa não existe", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.reopenTask(99)).rejects.toThrow(
      "Tarefa não encontrada."
    );
  });

  test("deleteTask deve remover e retornar a tarefa marcada como removida", async () => {
    repository.findById.mockResolvedValue(TASK);
    repository.softDelete.mockResolvedValue(undefined);

    await expect(service.deleteTask(1)).resolves.toEqual({
      ...TASK,
      isDeleted: true
    });
    expect(repository.softDelete).toHaveBeenCalledWith(1);
  });

  test("deleteTask deve lançar erro quando a tarefa não existe", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.deleteTask(99)).rejects.toThrow(
      "Tarefa não encontrada."
    );
    expect(repository.softDelete).not.toHaveBeenCalled();
  });
});
