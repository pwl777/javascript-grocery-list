/* ------ JavaScript - Grocery List ------ */

/* =============== Select Items =============== */

const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

/* =============== Edit Options =============== */

let editElement;
let editFlag = false;
let editID = "";

/* =============== Event Listeners =============== */

// --- Submit Form ---
form.addEventListener("submit", addItem);
// --- Clear Items ---
clearBtn.addEventListener("click", clearItems);
// --- Load items ---
window.addEventListener("DOMContentLoaded", setupItems);

/* =============== Functions =============== */

function addItem(e) {
  e.preventDefault(); // Stopping usual behaviour for this test project.
  //   console.log(grocery.value);
  const value = grocery.value;
  const id = new Date().getTime().toString();
  //   console.log(id);
  if (value && !editFlag) {
    const element = document.createElement("article");
    // --- Add Class ---
    element.classList.add("grocery-item");
    // --- Add Id ---
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `            
    <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
    // --- Append Child ---
    list.appendChild(element);
    // --- Display Alert ---
    displayAlert("item added to the list", "success");
    // --- Show Container ---
    container.classList.add("show-container");
    // --- Add To Local Storage ---
    addToLocalStorage(id, value);
    // --- Set Input Field Back To Default ---
    setBackToDefault();
  } else if (value && editFlag) {
    // console.log("editing");
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    // --- Edit Local Storage ---
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter a value", "danger");
  }
}
// --- Display Alert ---

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // --- Remove Alert ---
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
// --- Clear Items ---
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// --- Delete Function ---

function deleteItem(e) {
  //   console.log("item deleted");
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  // --- Remove From Local Storage ---
  removeFromLocalStorage(id);
}

// --- Edit Function ---

function editItem(e) {
  //   console.log("edit item");
  const element = e.currentTarget.parentElement.parentElement;
  // --- Set Edit Item ---
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // --- Set Form Value ---
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editId = element.dataset.id;
  submitBtn.textContent = "edit";
}

// --- Set Input Field Back To Default ---

function setBackToDefault() {
  //   console.log("set back to default");
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

/* =============== Local Storage =============== */

function addToLocalStorage(id, value) {
  //   console.log("added to local storage");
  const grocery = { id, value };
  //   console.log(grocery);
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
function removeFromLocalStorage(id) {
  //   console.log("removed from local storage");
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// localStorage.setItem("orange", JSON.stringify(["item", "item2"]));
// const oranges = Json.parse(localStorage.getItem("orange"));
// console.log(oranges);
// localStorage.removeItem("orange");

/* =============== Setup Items =============== */

function setupItems() {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createdListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createdListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `            
    <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  // --- Append Child ---
  list.appendChild(element);
}
