const STORAGE_KEY = 'student-task-manager-tasks';

const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const message = document.querySelector('#form-message');
const totalCount = document.querySelector('#total-count');
const activeCount = document.querySelector('#active-count');
const doneCount = document.querySelector('#done-count');
const clearDoneButton = document.querySelector('#clear-done');

let tasks = loadTasks();

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch (error) {
    console.warn('تعذر قراءة المهام المحفوظة:', error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateStats() {
  const completed = tasks.filter((task) => task.completed).length;
  totalCount.textContent = tasks.length;
  activeCount.textContent = tasks.length - completed;
  doneCount.textContent = completed;
  emptyState.hidden = tasks.length > 0;
}

function renderTasks() {
  list.replaceChildren();

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `تحديد المهمة ${task.title} كمكتملة`);
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const title = document.createElement('span');
    title.className = 'task-text';
    title.textContent = task.title;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'حذف';
    deleteButton.setAttribute('aria-label', `حذف المهمة ${task.title}`);
    deleteButton.addEventListener('click', () => {
      tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, title, deleteButton);
    list.append(item);
  });

  updateStats();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = input.value.trim();

  if (!title) {
    message.textContent = 'اكتب عنوان المهمة أولاً.';
    input.focus();
    return;
  }

  tasks.unshift({ id: `${Date.now()}-${Math.random()}`, title, completed: false });
  saveTasks();
  renderTasks();
  input.value = '';
  message.textContent = 'تمت إضافة المهمة بنجاح.';
  input.focus();
});

clearDoneButton.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
  message.textContent = 'تم حذف المهام المكتملة.';
});

renderTasks();
