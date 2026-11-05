const express = require("express");
const taskRoutes = require("./routes/taskRoute");
const { metricsMiddleware, getMetrics, getContentType } = require("./metrics");

const app = express();

app.use(express.json());
app.use(metricsMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de tarefas funcionando."
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", getContentType());
  res.end(await getMetrics());
});

app.use("/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada."
  });
});

module.exports = app;
