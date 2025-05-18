const BASE_URL = "https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/"
let tasks = [];

async function initboard() {
    document.getElementById("menuTemplate").innerHTML = menu();
    document.querySelector("header").innerHTML = header();
    initAvatarSlider();
    await fetchTasks();
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
    document.getElementById("taskToDo").innerHTML = "";
    document.getElementById("taskInProgress").innerHTML = "";
    document.getElementById("taskAwaitFeedback").innerHTML = "";
    document.getElementById("taskDone").innerHTML = "";
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        if (tasks[taskIndex].status == "toDo") {
            document.getElementById("emptyTask0").classList.remove("emptyTask");
            document.getElementById("emptyTask0").classList.add("d_none");
            document.getElementById("taskToDo").innerHTML += renderCard(taskIndex);
        }
        else if (tasks[taskIndex].status == "inProgress") {
            document.getElementById("emptyTask1").classList.remove("emptyTask");
            document.getElementById("emptyTask1").classList.add("d_none");
            document.getElementById("taskInProgress").innerHTML += renderCard(taskIndex);
        }
        else if (tasks[taskIndex].status == "await") {
            document.getElementById("emptyTask2").classList.remove("emptyTask");
            document.getElementById("emptyTask2").classList.add("d_none");
            document.getElementById("taskAwaitFeedback").innerHTML += renderCard(taskIndex);
        }
        else if (tasks[taskIndex].status == "done") {
            document.getElementById("emptyTask3").classList.remove("emptyTask");
            document.getElementById("emptyTask3").classList.add("d_none");
            document.getElementById("taskDone").innerHTML += renderCard(taskIndex);
        }
    }
}