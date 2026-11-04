const repository = require("../repositories/taskRepository");

async function listTasks() {
  return repository.findAll();
}

async function getTask(id) {
  const task = await repository.findById(id);

  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }

  return task;
}

async function createTask(title) {
  validateTitle(title);
  return repository.create(title.trim());
}

async function updateTask(id, title) {
  validateTitle(title);
  await getTask(id);

  return repository.update(id, title.trim());
}

async function completeTask(id) {
  await getTask(id);
  return repository.setCompleted(id, true);
}

async function reopenTask(id) {
  await getTask(id);
  return repository.setCompleted(id, false);
}

async function deleteTask(id) {
  const task = await getTask(id);
  await repository.softDelete(id);

  return { ...task, isDeleted: true };
}

function validateTitle(title) {
  if (typeof title !== "string" || !title.trim()) {
    throw new Error("O título da tarefa é obrigatório.");
  }
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  completeTask,
  reopenTask,
  deleteTask
};