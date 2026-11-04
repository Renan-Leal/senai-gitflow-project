const express = require("express");
const taskRoutes = require("./routes/taskRoute");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de tarefas funcionando."
  });
});

app.use("/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada."
  });
});

module.exports = app;