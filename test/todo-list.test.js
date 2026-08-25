const assert = require("node:assert/strict");
const test = require("node:test");
const TodoList = require("../index");

test("addTask cria uma tarefa com dados padrão e título normalizado", () => {
  const todoList = new TodoList();

  const task = todoList.addTask("  Estudar JavaScript  ");

  assert.deepEqual(task, {
    id: 1,
    title: "Estudar JavaScript",
    completed: false,
    isDeleted: false
  });
  assert.equal(todoList.nextId, 2);
});

test("addTask rejeita título vazio ou inválido", () => {
  const todoList = new TodoList();

  assert.throws(() => todoList.addTask(""), {
    message: "O título da tarefa é obrigatório."
  });
  assert.throws(() => todoList.addTask("   "), {
    message: "O título da tarefa é obrigatório."
  });
  assert.throws(() => todoList.addTask(null), {
    message: "O título da tarefa é obrigatório."
  });
  assert.equal(todoList.tasks.length, 0);
});

test("listTasks retorna somente tarefas não excluídas", () => {
  const todoList = new TodoList();
  const firstTask = todoList.addTask("Primeira tarefa");
  todoList.addTask("Segunda tarefa");
  todoList.deleteTask(firstTask.id);

  assert.deepEqual(todoList.listTasks().map(task => task.title), ["Segunda tarefa"]);
});

test("updateTask altera e normaliza o título", () => {
  const todoList = new TodoList();
  todoList.addTask("Título antigo");

  const updatedTask = todoList.updateTask(1, "  Título novo  ");

  assert.equal(updatedTask.title, "Título novo");
  assert.equal(todoList.listTasks()[0].title, "Título novo");
});

test("updateTask rejeita título vazio ou tarefa inexistente", () => {
  const todoList = new TodoList();
  todoList.addTask("Tarefa");

  assert.throws(() => todoList.updateTask(1, ""), {
    message: "O título da tarefa é obrigatório."
  });
  assert.throws(() => todoList.updateTask(99, "Outro título"), {
    message: "Tarefa não encontrada."
  });
});

test("completeTask marca uma tarefa como concluída", () => {
  const todoList = new TodoList();
  todoList.addTask("Concluir tarefa");

  const completedTask = todoList.completeTask(1);

  assert.equal(completedTask.completed, true);
  assert.equal(todoList.listTasks()[0].completed, true);
});

test("reopenTask reabre uma tarefa concluída", () => {
  const todoList = new TodoList();
  todoList.addTask("Reabrir tarefa");
  todoList.completeTask(1);

  const reopenedTask = todoList.reopenTask(1);

  assert.equal(reopenedTask.completed, false);
  assert.equal(todoList.listTasks()[0].completed, false);
});

test("deleteTask faz exclusão lógica e impede novas operações na tarefa", () => {
  const todoList = new TodoList();
  const task = todoList.addTask("Excluir tarefa");

  const deletedTask = todoList.deleteTask(task.id);

  assert.equal(deletedTask.isDeleted, true);
  assert.deepEqual(todoList.listTasks(), []);
  assert.throws(() => todoList.completeTask(task.id), {
    message: "Tarefa não encontrada."
  });
  assert.throws(() => todoList.reopenTask(task.id), {
    message: "Tarefa não encontrada."
  });
});

test("operações com tarefa inexistente lançam erro", () => {
  const todoList = new TodoList();

  for (const operation of [
    () => todoList.completeTask(1),
    () => todoList.reopenTask(1),
    () => todoList.updateTask(1, "Título"),
    () => todoList.deleteTask(1)
  ]) {
    assert.throws(operation, { message: "Tarefa não encontrada." });
  }
});
