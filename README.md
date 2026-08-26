# SENAI Git Workflow Project

An intentionally small Node.js project created as a practical example for
teaching students how to practice Git workflow with real code changes.

The application is an in-memory to-do list. Its simple domain makes it easy to
focus on branches, commits, pull requests, merges, conflict resolution, and
tests without the distraction of a database or a web interface.

## Learning Goals

Students can use this repository to practice:

- Creating feature branches from `main`.
- Making small, focused commits.
- Writing and reviewing pull requests.
- Merging completed work into `main`.
- Handling merge conflicts deliberately.
- Running automated tests before sharing changes.

## Requirements

- Node.js 18 or newer
- Git

## Getting Started

Clone the repository and install the project metadata:

```bash
git clone <repository-url>
cd senai-gitflow-project
npm install
```

This project currently has no external dependencies, so `npm install` only
initializes the local npm environment.

## Running the Tests

Run the complete unit test suite with:

```bash
npm test
```

The tests use Node.js's built-in `node:test` runner and are located in
`test/todo-list.test.js`. They cover task creation, validation, listing,
updates, completion, reopening, logical deletion, and missing-task errors.

## Available API

```js
const TodoList = require("./index");

const todoList = new TodoList();
const task = todoList.addTask("Study Git workflow");

todoList.updateTask(task.id, "Practice Git workflow");
todoList.completeTask(task.id);
console.log(todoList.listTasks());
todoList.reopenTask(task.id);
todoList.deleteTask(task.id);
```

### Methods

| Method | Description |
| --- | --- |
| `addTask(title)` | Creates a new active task and assigns it an ID. |
| `listTasks()` | Returns all tasks that have not been logically deleted. |
| `updateTask(id, title)` | Updates an existing task title. |
| `completeTask(id)` | Marks an active task as completed. |
| `reopenTask(id)` | Marks an active task as incomplete. |
| `deleteTask(id)` | Performs a logical deletion by setting `isDeleted` to `true`. |

Task titles must be non-empty strings. Operations involving an unknown or
deleted task throw an error.

## Suggested Git Flow Exercise

Use the following workflow for each feature or improvement:

```bash
git switch main
git pull origin main
git switch -c feature/add-task-filter

# Make a focused change and add or update its tests.
npm test

git add .
git commit -m "Add task filtering"
git push -u origin feature/add-task-filter
```

Open a pull request, review the changes, confirm that the tests pass, and then
merge the branch into `main`. Delete the feature branch after the merge.

## Project Structure

```text
.
├── index.js                  # TodoList implementation
├── package.json              # Project metadata and npm scripts
├── README.md                 # Project and workflow documentation
└── test/
	└── todo-list.test.js     # Unit tests
```

## Scope

This is a teaching project, not a production task manager. Data is stored only
in memory and is lost when the Node.js process ends. That limitation keeps the
example focused on JavaScript fundamentals, automated testing, and Git
workflow practice.