const BASE_URL = "https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/"
let tasks = [];
let colorVariants = ["variant1", "variant2", "variant3", "variant4", "variant5", "variant6", "variant7", "variant8", "variant9", "variant10", "variant11", "variant12", "variant13", "variant14", "variant15"]
let categoryVariants = [];

async function initboard() {
    document.getElementById("menuTemplate").innerHTML = checkLogged();
    document.querySelector("header").innerHTML = header();
    initAvatarSlider();
    await fetchTasks();
    clearBoardTable();
    renderTasks();
    
}

async function fetchTasks() {
    let taskResponse = await getAllTasks("tasks");
    tasks = Object.values(taskResponse);
}

async function getAllTasks(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}

function renderTasks() {
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        if (tasks[taskIndex].status == "toDo") {
            renderTaskToDo(taskIndex);
        }
        else if (tasks[taskIndex].status == "inProgress") {
            renderTaskInProgress(taskIndex);
        }
        else if (tasks[taskIndex].status == "await") {
            renderTaskAwait(taskIndex);
        }
        else if (tasks[taskIndex].status == "done") {
            renderDone(taskIndex);
        }
    }
}

function clearBoardTable() {
    document.getElementById("taskToDo").innerHTML = "";
    document.getElementById("taskInProgress").innerHTML = "";
    document.getElementById("taskAwaitFeedback").innerHTML = "";
    document.getElementById("taskDone").innerHTML = "";
}

function renderTaskToDo(taskIndex) {
    document.getElementById("emptyTask0").classList.remove("emptyTask");
    document.getElementById("emptyTask0").classList.add("d_none");
    document.getElementById("taskToDo").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex)
}

function renderTaskInProgress(taskIndex) {
    document.getElementById("emptyTask1").classList.remove("emptyTask");
    document.getElementById("emptyTask1").classList.add("d_none");
    document.getElementById("taskInProgress").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex)
}

function renderTaskAwait(taskIndex) {
    document.getElementById("emptyTask2").classList.remove("emptyTask");
    document.getElementById("emptyTask2").classList.add("d_none");
    document.getElementById("taskAwaitFeedback").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex)
}

function renderDone(taskIndex) {
    document.getElementById("emptyTask3").classList.remove("emptyTask");
    document.getElementById("emptyTask3").classList.add("d_none");
    document.getElementById("taskDone").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex)
}

function findBackgroundColor(taskIndex) {
    if (categoryVariants == "") {
        document.getElementById("taskCategory#" + taskIndex).classList.add(colorVariants[0]);
        categoryVariants.push({
            variant: colorVariants[0],
            category: tasks[taskIndex].category,
        })
    } else if (categoryVariants.find(({ category }) => category == tasks[taskIndex].category)) {
        let searchWord = tasks[taskIndex].category;
        let categoryVariantsIndex = categoryVariants.findIndex(v => v.category === searchWord);
        document.getElementById("taskCategory#" + taskIndex).classList.add(categoryVariants[categoryVariantsIndex].variant)
    } else {
                categoryVariants.push({
            variant: colorVariants[categoryVariants.length],
            category: tasks[taskIndex].category,
        })
        document.getElementById("taskCategory#" + taskIndex).classList.add(colorVariants[categoryVariants.length -1])
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.taskSearchInput');
    searchInput.addEventListener('input', filterTasks);
});

function filterTasks(event) {
    const searchTerm = event.target.value.toLowerCase();

    const taskCards = document.querySelectorAll('.taskCard');

    taskCards.forEach(card => {
        const content = card.innerText.toLowerCase();
        card.style.display = content.includes(searchTerm) ? 'block' : 'none';
    });
}

