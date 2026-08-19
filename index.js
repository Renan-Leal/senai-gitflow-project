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
        const task = this.tasks.find(task => task.id === id);
    
        if (!task) {
          throw new Error("Tarefa não encontrada.");
        }
    
        task.completed = true;
        return task;
      }
}
