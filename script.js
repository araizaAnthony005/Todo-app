const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

// Load tasks from localStorage on page load
window.addEventListener("DOMContentLoaded", loadTasks);

// Add task on button click
addBtn.addEventListener("click", addTask);

// Add task on Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = input.value.trim();
  if (taskText === "") return;

  const taskEl = createTaskElement(taskText);
  taskList.appendChild(taskEl);
  saveTask(taskText);

  input.value = "";
}

function createTaskElement(text, isCompleted = false) {
  const li = document.createElement("li");
  li.textContent = text;
  if (isCompleted) li.classList.add("completed");

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateStorage();
  });

  const delBtn = document.createElement("button");
  delBtn.className = "delete-btn";
  delBtn.innerHTML = "🗑️";
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    updateStorage();
  });

  li.appendChild(delBtn);
  return li;
}

function saveTask(text) {
  const tasks = getSavedTasks();
  tasks.push({ text, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getSavedTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function updateStorage() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach((li) => {
    tasks.push({
      text: li.childNodes[0].nodeValue,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getSavedTasks();
  tasks.forEach((task) => {
    const el = createTaskElement(task.text, task.completed);
    taskList.appendChild(el);
  });

  // FILTER FUNCTIONALITY
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active").classList.remove("active");
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      filterTasks(filter);
    });
  });

  function filterTasks(filter) {
    const tasks = document.querySelectorAll("#task-list li");
    tasks.forEach((task) => {
      const isCompleted = task.classList.contains("completed");

      if (
        filter === "all" ||
        (filter === "active" && !isCompleted) ||
        (filter === "completed" && isCompleted)
      ) {
        task.style.display = "flex";
      } else {
        task.style.display = "none";
      }
    });
  }
  // THEME TOGGLE
  const themeBtn = document.getElementById("toggle-theme");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeBtn.textContent = "☀️";
  } else {
    themeBtn.textContent = "🌓";
  }

  themeBtn.addEventListener("click", () => {
    const theme = document.documentElement.getAttribute("data-theme");

    if (theme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      themeBtn.textContent = "🌓";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      themeBtn.textContent = "☀️";
    }
  });
}
