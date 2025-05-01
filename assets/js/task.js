document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    taskManager.init();
});

class TaskManager {
    constructor() {
        this.titleInput = document.getElementById('titleTask');
        this.taskInput = document.getElementById('writeTask');
        this.createBtn = document.getElementById('createTask');
        this.taskList = document.querySelector('.list-task');
        this.gridContainer = document.querySelector('.grid-taskcreate');
        this.tasks = [];
    }

    init() {
        this.setupEventListeners();
        this.loadTasksFromLocalStorage();
        
        // Mostrar contenedor si hay tareas
        if (this.tasks.length > 0) {
            this.gridContainer.style.display = 'block';
        }
    }

    setupEventListeners() {
        this.createBtn.addEventListener('click', () => this.createNewTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createNewTask();
        });
        this.titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.createNewTask();
        });
    }

    createNewTask() {
        const title = this.titleInput.value.trim();
        const content = this.taskInput.value.trim();

        if (!this.validateInputs(title, content)) return;

        const task = {
            id: Date.now(),
            title,
            content,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.renderTask(task);
        this.saveTasksToLocalStorage();
        this.clearInputs();
        
        // Mostrar el contenedor si estaba oculto
        if (this.gridContainer.style.display === 'none') {
            this.gridContainer.style.display = 'block';
        }
    }

    validateInputs(title, content) {
        if (!title || !content) {
            this.showError('Por favor, completa ambos campos');
            return false;
        }
        return true;
    }

    renderTask(task) {
        const taskElement = this.createTaskElement(task);
        this.taskList.appendChild(taskElement);
        this.setupTaskEventListeners(taskElement, task.id);
        this.animateTaskAppearance(taskElement);
    }

    createTaskElement(task) {
        const taskElement = document.createElement('li');
        taskElement.className = `item-task ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;
        taskElement.innerHTML = `
            <h2>${task.title}</h2>
            <p>${task.content}</p>
            <input class="check-task" type="checkbox" ${task.completed ? 'checked' : ''}>
            <button class="btndelate-task">
                <span class="icon-delate material-symbols-outlined">delete</span>
            </button>
            <span class="task-date">${new Date(task.createdAt).toLocaleString()}</span>
        `;
        return taskElement;
    }

    setupTaskEventListeners(taskElement, taskId) {
        const deleteBtn = taskElement.querySelector('.btndelate-task');
        const checkBox = taskElement.querySelector('.check-task');

        deleteBtn.addEventListener('click', () => this.deleteTask(taskId, taskElement));
        checkBox.addEventListener('change', (e) => this.toggleTaskCompletion(taskId, e.target.checked, taskElement));
    }

    animateTaskAppearance(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    }

    deleteTask(taskId, taskElement) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;
        
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasksToLocalStorage();
        
        taskElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            taskElement.remove();
            
            // Ocultar contenedor si no hay más tareas
            if (this.taskList.children.length === 0) {
                this.gridContainer.style.display = 'none';
            }
        }, 300);
    }

    toggleTaskCompletion(taskId, isCompleted, taskElement) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = isCompleted;
            this.saveTasksToLocalStorage();
            taskElement.classList.toggle('completed', isCompleted);
        }
    }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        document.body.appendChild(errorElement);
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }

    clearInputs() {
        this.titleInput.value = '';
        this.taskInput.value = '';
        this.titleInput.focus();
    }

    saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasksFromLocalStorage() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.tasks.forEach(task => this.renderTask(task));
        }
    }
}