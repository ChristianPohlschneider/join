let colorVariants = ["variant1", "variant2", "variant3", "variant4", "variant5", "variant6", "variant7", "variant8", "variant9", "variant10", "variant11", "variant12", "variant13", "variant14", "variant15"]
let categoryVariants = [];
let subtaskArray = [];
let assignedTo = [];
let assignedToVariants = [];
let subtask = 0;
let subtaskTotal = 0;
let currentId;


// async function loadContacts() {
//     const res = await fetch(BASE_URL + "contacts.json");
//     contacts = await res.json();
// }

async function initboard() {
    document.getElementById("menuTemplate").innerHTML = checkLogged();
    document.querySelector("header").innerHTML = header();
    initAvatarSlider();
    await fetchTasks();
    await fetchContacts();
    clearBoardTable();
    renderTasks(contacts);
}

function renderTasks(contacts) {
    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        if (tasks[taskIndex].status == "toDo") {
            renderTaskToDo(taskIndex, contacts);
        }
        else if (tasks[taskIndex].status == "inProgress") {
            renderTaskInProgress(taskIndex, contacts);
        }
        else if (tasks[taskIndex].status == "await") {
            renderTaskAwait(taskIndex, contacts);
        }
        else if (tasks[taskIndex].status == "done") {
            renderDone(taskIndex, contacts);
        }
    }
}

function clearBoardTable() {
    document.getElementById("taskToDo").innerHTML = "";
    document.getElementById("taskInProgress").innerHTML = "";
    document.getElementById("taskAwaitFeedback").innerHTML = "";
    document.getElementById("taskDone").innerHTML = "";
    document.getElementById("emptyTask0").classList.remove("d_none");
    document.getElementById("emptyTask0").classList.add("emptyTask");
    document.getElementById("emptyTask1").classList.remove("d_none");
    document.getElementById("emptyTask1").classList.add("emptyTask");
    document.getElementById("emptyTask2").classList.remove("d_none");
    document.getElementById("emptyTask2").classList.add("emptyTask");
    document.getElementById("emptyTask3").classList.remove("d_none");
    document.getElementById("emptyTask3").classList.add("emptyTask");
}

function renderTaskToDo(taskIndex, contacts) {
    document.getElementById("emptyTask0").classList.remove("emptyTask");
    document.getElementById("emptyTask0").classList.add("d_none");
    document.getElementById("taskToDo").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
}

function renderTaskInProgress(taskIndex, contacts) {
    document.getElementById("emptyTask1").classList.remove("emptyTask");
    document.getElementById("emptyTask1").classList.add("d_none");
    document.getElementById("taskInProgress").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
}

function renderTaskAwait(taskIndex, contacts) {
    document.getElementById("emptyTask2").classList.remove("emptyTask");
    document.getElementById("emptyTask2").classList.add("d_none");
    document.getElementById("taskAwaitFeedback").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
}

function renderDone(taskIndex, contacts) {
    document.getElementById("emptyTask3").classList.remove("emptyTask");
    document.getElementById("emptyTask3").classList.add("d_none");
    document.getElementById("taskDone").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
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
    subtask = 0;
    if (tasks[taskIndex].subtasks === undefined) {
        document.getElementById("subtasks#" + taskIndex).style.display = "none";
    }
    getSubtaskIndex(taskIndex);
    for (let subtaskIndex = 0; subtaskIndex < subtaskArray.length; subtaskIndex++) {
        if (subtaskArray[subtaskIndex].done == true) {
            subtask++;
        }
        subtaskTotal++;
    }
    renderSubtasks(taskIndex);
}

function renderSubtasks(taskIndex) {
    document.getElementById("subtaskDone#" + taskIndex).innerHTML = subtask + "/" + subtaskTotal + " Subtask";
    document.getElementById("innerScale#" + taskIndex).style.width = Math.abs(Number((subtask / subtaskTotal) * 128)) + "px";
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

function getPriority(taskIndex) {
    let cardPriority = tasks[taskIndex].priority;
    if (cardPriority == "urgent") {
        document.getElementById("priority#" + taskIndex).innerHTML = renderPriority(taskIndex, cardPriority);
    } else if (cardPriority == "medium") {
        document.getElementById("priority#" + taskIndex).innerHTML = renderPriority(taskIndex, cardPriority);
    } else {
        document.getElementById("priority#" + taskIndex).innerHTML = renderPriority(taskIndex, cardPriority);
    }
}

function getAssignedTo(taskIndex, contacts) {
    getAssignedToInitials(taskIndex, contacts);
}

function getAssignedToInitials(taskIndex, contacts) {
    for (const [key, value] of Object.entries(tasks[taskIndex].assigned_to)) {
        let nameValue = replaceUmlauts(value);
        assignedTo.push(`${nameValue}`);
    }
    establishInitials(taskIndex, contacts);
    assignedTo = [];
}

function establishInitials(taskIndex, contacts) {
    for (let index = 0; index < assignedTo.length; index++) {
        let name = assignedTo[index];
        let parts = name.split(' ')
        let initials = ''
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].length > 0 && parts[i] !== '') {
                initials += parts[i][0]
            }
        }
        document.getElementById("assignedTo#" + taskIndex).innerHTML += renderInitials(taskIndex, initials, index);
        getAssignedToVariants(taskIndex, initials, index, contacts);
    }
}

function getAssignedToVariants(taskIndex, initials, index, contacts) {
    let nameToFind = replaceUmlauts(Object.entries(tasks[taskIndex].assigned_to)[index][1]);
    if (contacts.find(({ name }) => replaceUmlauts(name) == nameToFind)) {
        establishKnownVariant(taskIndex, initials, index);
    } else {
        document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).style.backgroundColor = getRandomColor();
        if (index != 0) {
            document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).classList.add("positionAddInitials");
        }
    }
}

function replaceUmlauts(string) {
    value = string;
    value = value.replace(/ä/g, 'ae');
    value = value.replace(/ö/g, 'oe');
    value = value.replace(/ü/g, 'ue');
    value = value.replace(/Ä/g, 'Ae');
    value = value.replace(/Ö/g, 'Oe');
    value = value.replace(/Ü/g, 'Ue');
    return value;
}

function establishKnownVariant(taskIndex, initials, index) {
    let searchWord = Object.entries(tasks[taskIndex].assigned_to)[index][1];
    let colorIndex = contacts.findIndex(v => replaceUmlauts(v.name) === replaceUmlauts(searchWord));
    document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).style.backgroundColor = contacts[colorIndex].color;
    if (index != 0) {
        document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).classList.add("positionAddInitials");
    }
}

function getRandomColor() {
    const colors = ["#6E52FF", "#FFA35E", "#FFE62B", "#00BEE8", "#FF5EB3", "#FFBB2B", "#FF745E", "#C3FF2B", "#FF7A00", "#1FD7C1", "#0038FF", "#FFC701", "#9327FF", "#FC71FF", "#FF4646"];
    return colors[Math.floor(Math.random() * colors.length)];
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
        card.style.display = content.includes(searchTerm) ? 'flex' : 'none';
    });
}

function startDragging(id) {
    currentId = id;
    showVisibleFeedbackOnDrag(currentId);
}

async function moveTo(status) {
    tasks[currentId].status = status;
    await fetchContacts();
    clearBoardTable();
    renderTasks(contacts);
    currentTaskPath = BASE_URL + "tasks/" + Object.keys(taskResponse)[currentId] + "/status";
    putData(currentTaskPath, status);
    hideVisibleFeedbackOnDrag();
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

//dragover with visible feedback
function showVisibleFeedbackOnDrag(currentId) {
    // document.getElementById("card").style.cursor = "grabbing";
    if (tasks[currentId].status == "toDo") {
    const dragElement = document.getElementById('card');
    const dropZone = document.getElementById("dropzone#TaskInProgress").classList.remove("d_none");
    }
        if (tasks[currentId].status == "inProgress") {
    const dragElement = document.getElementById('card');
    const dropZone = document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
    }
        if (tasks[currentId].status == "await") {
    const dragElement = document.getElementById('card');
    const dropZone = document.getElementById("dropzone#TaskDone").classList.remove("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none")
    }
        if (tasks[currentId].status == "done") {
    const dragElement = document.getElementById('card');
    const dropZone = document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
    }
}

function hideVisibleFeedbackOnDrag() {
    document.getElementById("dropzone#TaskToDo").classList.add("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.add("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.add("d_none");
    document.getElementById("dropzone#TaskDone").classList.add("d_none");
}
