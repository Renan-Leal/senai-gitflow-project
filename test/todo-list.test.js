const TodoList = require("../index");

test("addTask cria uma tarefa com dados padrão e título normalizado", () => {
  const todoList = new TodoList();

  const task = todoList.addTask("  Estudar JavaScript  ");

  expect(task).toEqual({
    id: 1,
    title: "Estudar JavaScript",
    completed: false,
    isDeleted: false
  });
  expect(todoList.nextId).toBe(2);
});

test("addTask rejeita título vazio ou inválido", () => {
  const todoList = new TodoList();

  expect(() => todoList.addTask("")).toThrow("O título da tarefa é obrigatório.");
  expect(() => todoList.addTask("   ")).toThrow("O título da tarefa é obrigatório.");
  expect(() => todoList.addTask(null)).toThrow("O título da tarefa é obrigatório.");
  expect(todoList.tasks).toHaveLength(0);
});

test("listTasks retorna somente tarefas não excluídas", () => {
  const todoList = new TodoList();
  const firstTask = todoList.addTask("Primeira tarefa");
  todoList.addTask("Segunda tarefa");
  todoList.deleteTask(firstTask.id);

  expect(todoList.listTasks().map(task => task.title)).toEqual(["Segunda tarefa"]);
});

test("updateTask altera e normaliza o título", () => {
  const todoList = new TodoList();
  todoList.addTask("Título antigo");

  const updatedTask = todoList.updateTask(1, "  Título novo  ");

  expect(updatedTask.title).toBe("Título novo");
  expect(todoList.listTasks()[0].title).toBe("Título novo");
});

test("updateTask rejeita título vazio ou tarefa inexistente", () => {
  const todoList = new TodoList();
  todoList.addTask("Tarefa");

  expect(() => todoList.updateTask(1, "")).toThrow("O título da tarefa é obrigatório.");
  expect(() => todoList.updateTask(99, "Outro título")).toThrow("Tarefa não encontrada.");
});

test("completeTask marca uma tarefa como concluída", () => {
  const todoList = new TodoList();
  todoList.addTask("Concluir tarefa");

  const completedTask = todoList.completeTask(1);

  expect(completedTask.completed).toBe(true);
  expect(todoList.listTasks()[0].completed).toBe(true);
});

test("reopenTask reabre uma tarefa concluída", () => {
  const todoList = new TodoList();
  todoList.addTask("Reabrir tarefa");
  todoList.completeTask(1);

  const reopenedTask = todoList.reopenTask(1);

  expect(reopenedTask.completed).toBe(false);
  expect(todoList.listTasks()[0].completed).toBe(false);
});

test("deleteTask faz exclusão lógica e impede novas operações na tarefa", () => {
  const todoList = new TodoList();
  const task = todoList.addTask("Excluir tarefa");

  const deletedTask = todoList.deleteTask(task.id);

  expect(deletedTask.isDeleted).toBe(true);
  expect(todoList.listTasks()).toEqual([]);
  expect(() => todoList.completeTask(task.id)).toThrow("Tarefa não encontrada.");
  expect(() => todoList.reopenTask(task.id)).toThrow("Tarefa não encontrada.");
});

test("operações com tarefa inexistente lançam erro", () => {
  const todoList = new TodoList();

  for (const operation of [
    () => todoList.completeTask(1),
    () => todoList.reopenTask(1),
    () => todoList.updateTask(1, "Título"),
    () => todoList.deleteTask(1)
  ]) {
    expect(operation).toThrow("Tarefa não encontrada.");
  }
});
