jest.mock("../src/config/database", () => ({
  execute: jest.fn()
}));

const db = require("../src/config/database");
const repository = require("../src/repositories/taskRepository");

describe("TaskRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("findAll deve retornar tarefas mapeadas com booleanos", async () => {
    db.execute.mockResolvedValue([
      [
        { id: 1, title: "A", completed: 1, isDeleted: 0 },
        { id: 2, title: "B", completed: 0, isDeleted: 0 }
      ]
    ]);

    await expect(repository.findAll()).resolves.toEqual([
      { id: 1, title: "A", completed: true, isDeleted: false },
      { id: 2, title: "B", completed: false, isDeleted: false }
    ]);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test("findById deve retornar a tarefa encontrada", async () => {
    db.execute.mockResolvedValue([
      [{ id: 3, title: "C", completed: 0, isDeleted: 0 }]
    ]);

    await expect(repository.findById(3)).resolves.toEqual({
      id: 3,
      title: "C",
      completed: false,
      isDeleted: false
    });
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [3]);
  });

  test("findById deve retornar null quando não existe", async () => {
    db.execute.mockResolvedValue([[]]);

    await expect(repository.findById(99)).resolves.toBeNull();
  });

  test("create deve inserir e retornar a tarefa criada", async () => {
    db.execute
      .mockResolvedValueOnce([{ insertId: 7 }])
      .mockResolvedValueOnce([
        [{ id: 7, title: "Nova", completed: 0, isDeleted: 0 }]
      ]);

    await expect(repository.create("Nova")).resolves.toEqual({
      id: 7,
      title: "Nova",
      completed: false,
      isDeleted: false
    });
    expect(db.execute).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO tasks (title) VALUES (?)",
      ["Nova"]
    );
  });

  test("update deve atualizar o título e retornar a tarefa", async () => {
    db.execute
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([
        [{ id: 1, title: "Editada", completed: 0, isDeleted: 0 }]
      ]);

    const task = await repository.update(1, "Editada");

    expect(task.title).toBe("Editada");
    expect(db.execute).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("UPDATE tasks SET title = ?"),
      ["Editada", 1]
    );
  });

  test("setCompleted deve atualizar o status e retornar a tarefa", async () => {
    db.execute
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([
        [{ id: 1, title: "A", completed: 1, isDeleted: 0 }]
      ]);

    const task = await repository.setCompleted(1, true);

    expect(task.completed).toBe(true);
    expect(db.execute).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("UPDATE tasks SET completed = ?"),
      [true, 1]
    );
  });

  test("softDelete deve marcar a tarefa como removida", async () => {
    db.execute.mockResolvedValue([{ affectedRows: 1 }]);

    await expect(repository.softDelete(4)).resolves.toBeUndefined();
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining("is_deleted = TRUE"),
      [4]
    );
  });
});
