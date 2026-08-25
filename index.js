class TodoList {
    constructor() {
      this.tasks = [];
      this.nextId = 1;
    }
  
    addTask(title) {
      if (typeof title !== "string" || title.trim() === "") {
        throw new Error("O título da tarefa é obrigatório.");
      }
  
      const task = {
        id: this.nextId++,
        title: title.trim(),
        completed: false,
        isDeleted: false
      };
   
      this.tasks.push(task);
      return task;
    }

    completeTask(id) {
      const task = this.findActiveTask(id);

      task.completed = true;
      return task;
    }

    reopenTask(id) {
      const task = this.findActiveTask(id);

      task.completed = false;
      return task;
    }

    updateTask(id, title) {
      if (typeof title !== "string" || title.trim() === "") {
        throw new Error("O título da tarefa é obrigatório.");
      }

      const task = this.findActiveTask(id);
      task.title = title.trim();
      return task;
    }

    deleteTask(id) {
      const task = this.findActiveTask(id);

      task.isDeleted = true;
      return task;
    }

    listTasks() {
      return this.tasks.filter(task => !task.isDeleted);
    }

    findActiveTask(id) {
      const task = this.tasks.find(task => task.id === id && !task.isDeleted);

      if (!task) {
        throw new Error("Tarefa não encontrada.");
      }

      return task;
    }
}

module.exports = TodoList;
