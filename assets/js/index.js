let selectedDay = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const renderMainTasks = (day = null) => {
  const data = JSON.parse(localStorage.getItem("tasks"))[
    !day ? selectedDay[new Date().getDay()] : day
  ];
  let mainTaskContainer = document.getElementById("main-task-list-container");
  mainTaskContainer.innerHTML = "";
  if (data) {
    data.forEach((element) => {
      mainTaskContainer.appendChild(document.createElement("li")).innerHTML = `
    <span class="main-task-name">${element.title}<br>
      <span class="main-task-description">${element.description}</span>
    </span>
    <span class="task-advance">${element.progress}%</span>`;
    });
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
      selectedDay = weekPills[i].innerText;
      weekPills[i].classList.add("active");
      renderMainTasks(selectedDay);
    });
  }
};

/**
 * Inicializa el control de la modal a través de los elementos/eventos del DOM
 */
const modalInitiator = () => {
  let modalElem = document.querySelector("#main-modal");
  let mainModalBtn = document.querySelector("#new-task-btn");
  let cancelMainModalBtn = document.querySelector("#main-modal-cancel-btn");
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
  console.log(minDate, maxDate);
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

/**
 * Llamadas a funciones inicializadoras
 */
modalInitiator();
weekInitiation(new Date().getDay());
renderMainTasks();
dateInputValidation();
