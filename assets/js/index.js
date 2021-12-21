let selectedDay = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
][new Date().getDay()];

const mockData = {
  Martes: [
    {
      title: "Tarea 1",
      description: "Descripción de la tarea 1",
      subTasks: [{ text: "Mi subtarea", status: false }],
      progress: 0,
    },
  ],
};

console.log(JSON.stringify(mockData));

const renderMainTasks = () => {
  const data =
    JSON.parse(localStorage.getItem("tasks"))[selectedDay] ||
    mockData[selectedDay];
  if (data) {
    let mainTaskContainer = document.getElementById("main-task-list-container");
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
 * Llamadas a funciones inicializadoras
 */
modalInitiator();
weekInitiation(new Date().getDay());
renderMainTasks();
