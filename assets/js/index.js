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
