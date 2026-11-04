const express = require("express");
const service = require("../services/taskService");

const router = express.Router();

function handleError(res, error) {
  if (error.message === "Tarefa não encontrada.") {
    return res.status(404).json({ error: error.message });
  }

  if (error.message === "O título da tarefa é obrigatório.") {
    return res.status(400).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor." });
}

router.get("/", async (req, res) => {
  try {
    res.json(await service.listTasks());
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    res.json(await service.getTask(Number(req.params.id)));
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json(await service.createTask(req.body?.title));
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    res.json(
      await service.updateTask(Number(req.params.id), req.body?.title)
    );
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/:id/complete", async (req, res) => {
  try {
    res.json(await service.completeTask(Number(req.params.id)));
  } catch (error) {
    handleError(res, error);
  }
});

router.patch("/:id/reopen", async (req, res) => {
  try {
    res.json(await service.reopenTask(Number(req.params.id)));
  } catch (error) {
    handleError(res, error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.json(await service.deleteTask(Number(req.params.id)));
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;