// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addTodo');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clearCompleted');
const itemsLeft = document.getElementById('itemsLeft');
const emptyState = document.getElementById('emptyState');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// State
let todos = [];
let currentFilter = 'all';
let dragSrcEl = null;

// Theme toggle functionality
function setupThemeToggle() {
    // Set initial theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    });
}

// Initialize app
function init() {
    setupThemeToggle();
    loadTodos();
    renderTodos();
    setupEventListeners();
    updateStats();
    updateItemsLeft();
}

// Load todos from localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Render todos based on current filter
function renderTodos() {
    todoList.innerHTML = '';
    
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });
    
    if (filteredTodos.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filteredTodos.forEach((todo, index) => {
            const todoItem = document.createElement('li');
            todoItem.className = 'todo-item';
            todoItem.setAttribute('data-id', todo.id);
            todoItem.draggable = true;
            
            todoItem.innerHTML = `
                <div class="todo-check ${todo.completed ? 'checked' : ''}"></div>
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                <div class="todo-actions">
                    <button class="todo-edit"><i class="fas fa-edit"></i></button>
                    <button class="todo-delete"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            todoList.appendChild(todoItem);
        });
    }
    
    // Initialize drag and drop after rendering
    initDragAndDrop();
}

// Add new todo
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    const newTodo = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.unshift(newTodo);
    saveTodos();
    renderTodos();
    updateStats();
    updateItemsLeft();
    
    todoInput.value = '';
    todoInput.focus();
}

// Toggle todo completion status
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return {...todo, completed: !todo.completed};
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
    updateStats();
    updateItemsLeft();
}

// Edit todo text
function editTodo(id, newText) {
    if (newText.trim() === '') return;
    
    todos = todos.map(todo => {
        if (todo.id === id) {
            return {...todo, text: newText.trim()};
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
    updateItemsLeft();
}

// Clear completed todos
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateStats();
    updateItemsLeft();
}

// Update stats display
function updateStats() {
    totalTasksEl.textContent = todos.length;
    
    const completedCount = todos.filter(todo => todo.completed).length;
    completedTasksEl.textContent = completedCount;
    
    const pendingCount = todos.length - completedCount;
    pendingTasksEl.textContent = pendingCount;
}

// Update items left counter
function updateItemsLeft() {
    const pendingCount = todos.filter(todo => !todo.completed).length;
    itemsLeft.textContent = `${pendingCount} ${pendingCount === 1 ? 'item' : 'items'} left`;
}

// Change filter
function changeFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active');
    renderTodos();
}

// Setup drag and drop functionality
function initDragAndDrop() {
    const listItems = todoList.querySelectorAll('.todo-item');
    
    listItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (dragSrcEl !== this) {
        // Get IDs
        const draggedId = parseInt(dragSrcEl.getAttribute('data-id'));
        const targetId = parseInt(this.getAttribute('data-id'));
        
        // Find indices
        const draggedIndex = todos.findIndex(todo => todo.id === draggedId);
        const targetIndex = todos.findIndex(todo => todo.id === targetId);
        
        // Reorder array
        const [draggedTodo] = todos.splice(draggedIndex, 1);
        todos.splice(targetIndex, 0, draggedTodo);
        
        // Save and re-render
        saveTodos();
        renderTodos();
    }
    
    return false;
}

function handleDragEnd(e) {
    document.querySelectorAll('.todo-item').forEach(item => {
        item.classList.remove('over', 'dragging');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add todo
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            changeFilter(btn.getAttribute('data-filter'));
        });
    });
    
    // Clear completed
    clearBtn.addEventListener('click', clearCompleted);
    
    // Todo list event delegation
    todoList.addEventListener('click', (e) => {
        const todoItem = e.target.closest('.todo-item');
        if (!todoItem) return;
        
        const id = parseInt(todoItem.getAttribute('data-id'));
        
        // Checkbox click
        if (e.target.classList.contains('todo-check')) {
            toggleTodo(id);
            return;
        }
        
        // Edit button click
        if (e.target.classList.contains('todo-edit') || e.target.closest('.todo-edit')) {
            const todoText = todoItem.querySelector('.todo-text');
            const currentText = todoText.textContent;
            
            // Create input field
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'edit-input';
            input.value = currentText;
            
            // Replace text with input
            todoText.style.display = 'none';
            todoText.parentNode.insertBefore(input, todoText);
            input.focus();
            
            // Handle save
            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText) {
                    editTodo(id, newText);
                } else {
                    todoText.style.display = 'block';
                    input.remove();
                }
            };
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveEdit();
            });
            
            input.addEventListener('blur', saveEdit);
            return;
        }
        
        // Delete button click
        if (e.target.classList.contains('todo-delete') || e.target.closest('.todo-delete')) {
            deleteTodo(id);
            return;
        }
    });
}

// Initialize the app
init();