const taskInput = document.getElementById('task-input');
const taskDueDate = document.getElementById('task-due-date');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');


class Task {
    constructor(description, dueDate) {
        this.description = description;
        this.dueDate = dueDate;
        this.isCompleted = false;
    }
}

let tasks = [];


function saveTasks() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('myTasks');
    if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        tasks = parsedTasks.map(taskData => {
            const task = new Task(taskData.description, taskData.dueDate);
            task.isCompleted = taskData.isCompleted;
            return task;
        });
        renderTasks();
    }
}

function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.isCompleted ? 'completed' : ''}`;
        const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        
        li.innerHTML = `
            <div class="task-content">
                <div class="task-description">${task.description}</div>
                <div class="task-due-date">Due: ${formattedDate}</div>
            </div>
            <div class="task-status ${task.isCompleted ? 'status-completed' : 'status-pending'}">
                ${task.isCompleted ? 'Completed' : 'Pending'}
            </div>
            <div class="delete-btn" title="Delete Task">&times;</div>
        `;

        li.addEventListener('click', () => {
            toggleTaskCompletion(index);
        });
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });
        taskList.appendChild(li);
    });
}

function toggleTaskCompletion(index) {
    tasks[index].isCompleted = !tasks[index].isCompleted;
    saveTasks();
    renderTasks();
}

function addTask() {
    const description = taskInput.value.trim();
    const dueDate = taskDueDate.value;

    if (description === '') {
        alert('Please enter a task description!');
        return;
    }

    const newTask = new Task(description, dueDate);
    
    tasks.push(newTask);
    
    saveTasks();
    
    renderTasks();
    
    taskInput.value = '';
    taskDueDate.value = '';
    
    taskInput.focus();
}

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    taskInput.focus();
});



