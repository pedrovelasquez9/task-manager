const selectedDay = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
let selectedId,
  taskSelectedDay = null;
let mainSelectedDay = selectedDay[new Date().getDay()];

/**
 *
 * @param {*} day
 * Renderiza las tareas del día seleccionado a partir de la data en localstorage
 *
 */

const renderMainTasks = (day = null) => {
  let chosenDay = !day ? selectedDay[new Date().getDay()] : day;
  const data = JSON.parse(localStorage.getItem("tasks"))[chosenDay];
  let mainTaskContainer = document.getElementById("main-task-list-container");
  mainTaskContainer.innerHTML = "";
  if (data) {
    data.forEach((element, index) => {
      // TODO: refactor this crap
      let liElem = document.createElement("li");
      liElem.setAttribute("id", index);
      liElem.addEventListener("click", (evt) => {
        openTaskModal(evt.target.id, chosenDay);
      });
      mainTaskContainer.appendChild(liElem).innerHTML = `
    <span class="main-task-name">${element.title}<br>
      <span class="main-task-description">${element.description}</span>
    </span>
    <span class="task-advance" id="progress-${chosenDay}-${index}">${element.progress}%</span>`;
    });
  } else {
    const errorMsg = "No tienes tareas para este día";
    mainTaskContainer.innerHTML = `
    <h1 class="no-tasks-message">${errorMsg}</h1>`;
  }
};

/**
 *
 * @param {*} actualDay
 * Inicializa con el día de la semana actual
 * Permite cambiar el día de la semana seleccionado
 *
 */
const weekInitiation = (actualDay = null) => {
  let weekPills = document
    .querySelector("#main-nav-pills")
    .getElementsByTagName("li");
  if (actualDay) {
    weekPills[actualDay].classList.add("active");
  }

  for (let i = 0; i < weekPills.length; i++) {
    weekPills[i].addEventListener("click", () => {
      for (let j = 0; j < weekPills.length; j++) {
        weekPills[j].classList.remove("active");
      }
      mainSelectedDay = weekPills[i].innerText;
      weekPills[i].classList.add("active");
      renderMainTasks(mainSelectedDay);
      calculateProgress();
    });
  }
};

/**
 * Inicializa el control de la modal a través de los elementos/eventos del DOM
 */
const modalInitiator = () => {
  const modalElem = document.querySelector("#main-modal");
  const mainModalBtn = document.querySelector("#new-task-btn");
  const cancelMainModalBtn = document.querySelector("#main-modal-cancel-btn");
  const addSubtaskBtn = document.querySelector("#add-subtask-btn");
  const taskModalCancelBtn = document.querySelector("#task-modal-cancel-btn");

  mainModalBtn.addEventListener("click", () => {
    modalElem.style.display = "block";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modalElem) {
      modalElem.style.display = "none";
    }
  });

  cancelMainModalBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    modalElem.style.display = "none";
  });

  addSubtaskBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    addNewSubtask();
  });

  taskModalCancelBtn.addEventListener("click", (evt) => {
    evt.preventDefault();
    modalElem.style.display = "none";
  });
};

/**
 * Open tasks modal
 */

const openTaskModal = (id, day) => {
  const modalElem = document.querySelector("#main-modal");
  taskSelectedDay = day;
  selectedId = id;
  modalElem.style.display = "block";
  document.querySelector("#main-form-modal-section").style = "display: none";
  document.querySelector("#task-form-modal-section").style = "display: flex";
  loadTasks();
};

/**
 * input date initial validation
 */
const dateInputValidation = () => {
  let minDate = new Date().toISOString().split("T")[0];

  let maxDate = new Date(
    new Date().setDate(new Date().getDate() + (7 - new Date().getDay()))
  )
    .toISOString()
    .split("T")[0];
  let dateInput = document.querySelector("#main-task-date");
  dateInput.setAttribute("min", minDate);
  dateInput.setAttribute("max", maxDate);
};

/**
 * Save main task in localStorage object
 */

const saveMainTask = () => {
  let mainTaskTitle = document.getElementById("main-task-title").value;
  let mainTaskDesc = document.getElementById("main-task-desc").value;
  let mainTaskDate = new Date(
    document.getElementById("main-task-date").value
  ).getDay();
  let localStorageData = JSON.parse(localStorage.getItem("tasks"));
  if (!localStorageData[selectedDay[mainTaskDate]]) {
    localStorageData[selectedDay[mainTaskDate]] = [];
  }
  localStorageData[selectedDay[mainTaskDate]].push({
    title: mainTaskTitle,
    description: mainTaskDesc,
    subTasks: [],
    progress: 0,
  });
  localStorage.setItem("tasks", JSON.stringify(localStorageData));
};

//Loads all previously created subtasks
const loadTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const subTasks = tasks[taskSelectedDay][selectedId].subTasks;
  subTasks.forEach((item) => {
    addNewSubtask(item);
  });
};

// Adds checkboxes dynamically to the modal form
const addNewSubtask = (item = null) => {
  const formSectionContainer = document.getElementById(
    "form-section-container"
  );
  const deleteIconElem = document.createElement("i");
  deleteIconElem.setAttribute("class", "fas fa-trash delete-icon");
  deleteIconElem.addEventListener("click", (evt) => {
    deleteSubtask(evt);
  });
  const newSection = document.createElement("section");
  newSection.setAttribute(
    "id",
    "new-subtask-section-" + Math.floor(Math.random() * 1000) + 1
  );
  newSection.setAttribute("class", "new-subtask-section-container");
  const newCheckbox = document.createElement("input");
  newCheckbox.setAttribute("type", "checkbox");
  newCheckbox.setAttribute("name", "subtask-" + Math.random());
  newCheckbox.setAttribute("id", "subtask-" + Math.random());
  newCheckbox.setAttribute("class", "subtask-checkbox");
  const newInput = document.createElement("input");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("class", "subtask-input");
  newInput.setAttribute("required", true);
  newInput.setAttribute("placeholder", "Subtarea");
  if (item) {
    const { value, title } = item;
    value ? newCheckbox.setAttribute("checked", value) : null;
    newInput.setAttribute("value", title);
  }
  newSection.appendChild(newCheckbox);
  newSection.appendChild(newInput);
  newSection.appendChild(deleteIconElem);
  formSectionContainer.appendChild(newSection);
};

const saveSubtasks = () => {
  let newSubtasks = [];
  const modalElem = document.querySelector("#main-modal");
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  const formSection = document.getElementById("form-section-container");
  if (formSection.children.length > 0) {
    formSection.childNodes.forEach((item) => {
      if (item.localName === "section") {
        let subtaskObj = {};
        item.childNodes.forEach((subtask) => {
          if (subtask.type === "text") {
            subtaskObj.title = subtask.value;
          }
          if (subtask.type === "checkbox") {
            subtaskObj.value = subtask.checked;
          }
        });
        newSubtasks.push(subtaskObj);
      }
    });
  }
  if (newSubtasks.length > 0) {
    tasks[taskSelectedDay][selectedId].subTasks = newSubtasks;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  modalElem.style.display = "none";
};

// Calculate % of completed tasks
const calculateProgress = () => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks[mainSelectedDay]) {
    tasks[mainSelectedDay].forEach((item, index) => {
      if (item.subTasks.length > 0) {
        item.progress = parseInt(
          (item.subTasks.filter((subtask) => subtask.value).length /
            item.subTasks.length) *
            100
        );
        let progressElem = document.getElementById(
          "progress-" + mainSelectedDay + "-" + index
        );
        progressElem.innerText = `${item.progress}%`;
        if (item.progress <= 40 && item.progress > 10) {
          progressElem.style.borderTop = "2px solid green";
        }
        if (item.progress <= 60 && item.progress > 40) {
          progressElem.style.borderTop = "2px solid green";
          progressElem.style.borderRight = "2px solid green";
        }
        if (item.progress <= 80 && item.progress > 60) {
          progressElem.style.borderTop = "2px solid green";
          progressElem.style.borderRight = "2px solid green";
          progressElem.style.borderBottom = "2px solid green";
        }
        if (item.progress <= 100 && item.progress > 80) {
          progressElem.style.borderTop = "2px solid green";
          progressElem.style.borderRight = "2px solid green";
          progressElem.style.borderBottom = "2px solid green";
          progressElem.style.borderLeft = "2px solid green";
        }
      }
    });
  }
};

// Delete a subtask
const deleteSubtask = (evt) => {
  evt.srcElement.parentNode.parentNode.removeChild(evt.srcElement.parentNode);
};

/**
 * Llamadas a funciones inicializadoras
 */
modalInitiator();
weekInitiation(new Date().getDay());
renderMainTasks();
dateInputValidation();
calculateProgress();
