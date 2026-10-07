const express = require("express");
const TodoList = require("./index");

const app = express();

app.use(express.json());

app.locals.todoList = new TodoList();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de tarefas funcionando."
  });
});

app.get("/tasks", (req, res) => {
  res.status(200).json(
    req.app.locals.todoList.listTasks()
  );
});

app.get("/tasks/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const task = req.app.locals.todoList.findActiveTask(id);

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({
      error: error.message
    });
  }
});

app.post("/tasks", (req, res) => {
  try {
    const { title } = req.body;

    const task = req.app.locals.todoList.addTask(title);

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

app.put("/tasks/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;

    const task = req.app.locals.todoList.updateTask(id, title);

    res.status(200).json(task);
  } catch (error) {
    if (error.message === "Tarefa não encontrada.") {
      return res.status(404).json({
        error: error.message
      });
    }

    res.status(400).json({
      error: error.message
    });
  }
});

app.patch("/tasks/:id/complete", (req, res) => {
  try {
    const id = Number(req.params.id);

    const task = req.app.locals.todoList.completeTask(id);

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({
      error: error.message
    });
  }
});

app.patch("/tasks/:id/reopen", (req, res) => {
  try {
    const id = Number(req.params.id);

    const task = req.app.locals.todoList.reopenTask(id);

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({
      error: error.message
    });
  }
});

app.delete("/tasks/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const task = req.app.locals.todoList.deleteTask(id);

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({
      error: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada."
  });
});

module.exports = app;