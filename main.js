// Task Class Definition
class Task {
    constructor(description, dueDate) {
        this.description = description;
        this.dueDate = dueDate;
        this.isCompleted = false;
    }
}

// Global tasks array
let tasks = [];

// DOM Elements
const taskInput = document.getElementById('task-input');
const taskDueDate = document.getElementById('task-due-date');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
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

// Render tasks to the DOM
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one above!</li>';
        return;
    }

    // Loop through tasks and create list items
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.isCompleted ? 'completed' : ''}`;
        
        // Format the due date for display
        const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        
        li.innerHTML = `
            <div class="task-content">
                <div class="task-description">${task.description}</div>
                <div class="task-due-date">Due: ${formattedDate}</div>
            </div>
            <div class="task-status ${task.isCompleted ? 'status-completed' : 'status-pending'}">
                ${task.isCompleted ? 'Completed' : 'Pending'}
            </div>
        `;

        // Add click event to toggle completion
        li.addEventListener('click', () => {
            toggleTaskCompletion(index);
        });

        taskList.appendChild(li);
    });
}

// Toggle task completion status
function toggleTaskCompletion(index) {
    tasks[index].isCompleted = !tasks[index].isCompleted;
    saveTasks();
    renderTasks();
}

// Add new task
function addTask() {
    const description = taskInput.value.trim();
    const dueDate = taskDueDate.value;

    if (description === '') {
        alert('Please enter a task description!');
        return;
    }

    // Create new Task instance
    const newTask = new Task(description, dueDate);
    
    // Add to tasks array
    tasks.push(newTask);
    
    // Save to localStorage
    saveTasks();
    
    // Re-render tasks
    renderTasks();
    
    // Clear input fields
    taskInput.value = '';
    taskDueDate.value = '';
    
    // Focus back to task input
    taskInput.focus();
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

// Allow adding task with Enter key
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    taskInput.focus();
});



