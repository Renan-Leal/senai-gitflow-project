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

Clone the repository and install the project dependencies:

```bash
git clone <repository-url>
cd senai-gitflow-project
npm install
```

The test runner used by this project is Jest and is installed as a development
dependency by `npm install`.

## Running the Tests

Execute the tests correctly from the project root by following these steps:

1. Install [Node.js 18 or newer](https://nodejs.org/).
2. Clone the repository and enter its directory.
3. Install the dependencies with `npm install`.
4. Run the complete Jest suite with:

```bash
npm test
```

The `npm test` script executes `jest --runInBand`, which runs all test files
without parallel workers and returns a failure code when any assertion fails.
The tests are located in `test/todo-list.test.js`.

To keep Jest running and rerun tests after each file change, use:

```bash
npm run test:watch
```

To run the tests and generate the coverage report automatically, use:

```bash
npm run test:coverage
```

The report is generated in `coverage/`. Open `coverage/lcov-report/index.html`
in a browser to view the detailed HTML report.

## Pipeline de testes

O workflow `.github/workflows/tests.yml` é executado automaticamente quando
uma PR é aberta ou atualizada e quando há push na branch `main`. Ele instala as
dependências com `npm ci`, executa os testes com coverage e valida a geração do
arquivo `coverage/lcov.info`.

O Jest reprova a execução quando qualquer métrica global ficar abaixo de 80%:
statements, branches, functions ou lines. Para impedir o merge de uma PR com
falha, configure o check `Tests / test` como obrigatório nas regras de proteção
da branch `main` em **Settings > Branches** no GitHub.

### Comportamentos garantidos pelos testes

- Criação de tarefas com ID sequencial, título sem espaços nas extremidades,
  status `completed: false` e `isDeleted: false`.
- Rejeição de títulos vazios, compostos apenas por espaços ou que não sejam
  strings, com a mensagem `O título da tarefa é obrigatório.`.
- Listagem somente de tarefas que não sofreram exclusão lógica.
- Atualização e normalização do título de uma tarefa ativa.
- Conclusão e reabertura de tarefas ativas.
- Exclusão lógica com `isDeleted: true`, impedindo novas operações nessa tarefa.
- Erro `Tarefa não encontrada.` para tarefas inexistentes ou excluídas.

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