const db = require("../config/database");

async function findAll() {
  const [rows] = await db.execute(
    `SELECT id, title, completed, is_deleted AS isDeleted
     FROM tasks
     WHERE is_deleted = FALSE
     ORDER BY id`
  );

  return rows.map(mapTask);
}

async function findById(id) {
  const [rows] = await db.execute(
    `SELECT id, title, completed, is_deleted AS isDeleted
     FROM tasks
     WHERE id = ? AND is_deleted = FALSE`,
    [id]
  );

  return rows.length ? mapTask(rows[0]) : null;
}

async function create(title) {
  const [result] = await db.execute(
    "INSERT INTO tasks (title) VALUES (?)",
    [title]
  );

  return findById(result.insertId);
}

async function update(id, title) {
  await db.execute(
    "UPDATE tasks SET title = ? WHERE id = ? AND is_deleted = FALSE",
    [title, id]
  );

  return findById(id);
}

async function setCompleted(id, completed) {
  await db.execute(
    "UPDATE tasks SET completed = ? WHERE id = ? AND is_deleted = FALSE",
    [completed, id]
  );

  return findById(id);
}

async function softDelete(id) {
  await db.execute(
    "UPDATE tasks SET is_deleted = TRUE WHERE id = ? AND is_deleted = FALSE",
    [id]
  );
}

function mapTask(row) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    isDeleted: Boolean(row.isDeleted)
  };
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  setCompleted,
  softDelete
};