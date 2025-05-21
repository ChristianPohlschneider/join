let colorVariants = ["variant1", "variant2", "variant3", "variant4", "variant5", "variant6", "variant7", "variant8", "variant9", "variant10", "variant11", "variant12", "variant13", "variant14", "variant15"]
let categoryVariants = [];
let subtaskArray = [];
let subtask = 0;
let subtaskTotal = 0;

async function initboard() {
    document.getElementById("menuTemplate").innerHTML = checkLogged();
    document.querySelector("header").innerHTML = header();
    initAvatarSlider();
    await fetchTasks();
    clearBoardTable();
    renderTasks();

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
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
}

function renderTaskInProgress(taskIndex) {
    document.getElementById("emptyTask1").classList.remove("emptyTask");
    document.getElementById("emptyTask1").classList.add("d_none");
    document.getElementById("taskInProgress").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
}

function renderTaskAwait(taskIndex) {
    document.getElementById("emptyTask2").classList.remove("emptyTask");
    document.getElementById("emptyTask2").classList.add("d_none");
    document.getElementById("taskAwaitFeedback").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
}

function renderDone(taskIndex) {
    document.getElementById("emptyTask3").classList.remove("emptyTask");
    document.getElementById("emptyTask3").classList.add("d_none");
    document.getElementById("taskDone").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
}

function findBackgroundColor(taskIndex) {
    if (categoryVariants.find(({ category }) => category == tasks[taskIndex].category)) {
        let searchWord = tasks[taskIndex].category;
        let categoryVariantsIndex = categoryVariants.findIndex(v => v.category === searchWord);
        document.getElementById("taskCategory#" + taskIndex).classList.add(categoryVariants[categoryVariantsIndex].variant)
    } else {
        categoryVariants.push({
            variant: colorVariants[categoryVariants.length],
            category: tasks[taskIndex].category,
        })
        document.getElementById("taskCategory#" + taskIndex).classList.add(colorVariants[categoryVariants.length - 1])
    }
}

function getSubtasks(taskIndex) {
    if (tasks[taskIndex].subtasks === undefined) {
        document.getElementById("subtasks#" + taskIndex).style.display ="none";
    }
    getSubtaskIndex(taskIndex);
    for (let subtaskIndex = 0; subtaskIndex < subtaskArray.length; subtaskIndex++) {
        subtask++;
        subtaskTotal++;
    }
    document.getElementById("subtaskDone#" + taskIndex).innerHTML = subtask + "/" + subtaskTotal + " Subtask";
    document.getElementById("innerScale#" + taskIndex).style.width = Math.abs(Number(128)) + "px";
    subtask = 0;
    subtaskTotal = 0;
    subtaskArray = [];
}

function getSubtaskIndex(taskIndex) {
const task = tasks[taskIndex];

if (task.subtasks) {
    Object.entries(task.subtasks).forEach(([key, value], subIndex) => {
        subtaskArray.push({
            taskIndex,
            subIndex,
            taskName: task.name,
            key,
            title: value.title,
            done: value.done
        });
    });
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

