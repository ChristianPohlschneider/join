let colorVariants = ["variant1", "variant2", "variant3", "variant4", "variant5", "variant6", "variant7", "variant8", "variant9", "variant10", "variant11", "variant12", "variant13", "variant14", "variant15"]
let categoryVariants = [];
let subtaskArray = [];
let assignedTo = [];
let assignedToVariants = [];
let subtask = 0;
let subtaskTotal = 0;

let currentId;

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
    document.getElementById("emptyTask0").classList.remove("d_none");
    document.getElementById("emptyTask0").classList.add("emptyTask");
    document.getElementById("emptyTask1").classList.remove("d_none");
    document.getElementById("emptyTask1").classList.add("emptyTask");
    document.getElementById("emptyTask2").classList.remove("d_none");
    document.getElementById("emptyTask2").classList.add("emptyTask");
    document.getElementById("emptyTask3").classList.remove("d_none");
    document.getElementById("emptyTask3").classList.add("emptyTask");
}

function renderTaskToDo(taskIndex) {
    document.getElementById("emptyTask0").classList.remove("emptyTask");
    document.getElementById("emptyTask0").classList.add("d_none");
    document.getElementById("taskToDo").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex);
    getPriority(taskIndex);
}

function renderTaskInProgress(taskIndex) {
    document.getElementById("emptyTask1").classList.remove("emptyTask");
    document.getElementById("emptyTask1").classList.add("d_none");
    document.getElementById("taskInProgress").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex);
    getPriority(taskIndex);
}

function renderTaskAwait(taskIndex) {
    document.getElementById("emptyTask2").classList.remove("emptyTask");
    document.getElementById("emptyTask2").classList.add("d_none");
    document.getElementById("taskAwaitFeedback").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex);
    getPriority(taskIndex);
}

function renderDone(taskIndex) {
    document.getElementById("emptyTask3").classList.remove("emptyTask");
    document.getElementById("emptyTask3").classList.add("d_none");
    document.getElementById("taskDone").innerHTML += renderCard(taskIndex);
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex);
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
    if (tasks[taskIndex].subtasks === undefined) {
        document.getElementById("subtasks#" + taskIndex).style.display = "none";
    }
    getSubtaskIndex(taskIndex);
    for (let subtaskIndex = 0; subtaskIndex < subtaskArray.length; subtaskIndex++) {
        subtask++;
        subtaskTotal++;
    }
    renderSubtasks(taskIndex);
}

function renderSubtasks(taskIndex) {
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

function getPriority(taskIndex) {
    let priority = tasks[taskIndex].priority;
    if (priority == "urgent") {
        document.getElementById("priority#" + taskIndex).innerHTML = renderPriority(taskIndex, priority);
    } else if (priority == "medium") {
        document.getElementById("priority#" + taskIndex).innerHTML = renderPriority(taskIndex, priority);
    } else {
        document.getElementById("priority#" + taskIndex).innerHTML = renderPriority(taskIndex, priority);
    }
}

function getAssignedTo(taskIndex) {
    getAssignedToInitials(taskIndex);
    getAssignedToVariants(taskIndex);
}

function getAssignedToInitials(taskIndex) {
    for (const [key, value] of Object.entries(tasks[taskIndex].assigned_to)) {
        assignedTo.push(`${key}`);
    }
    for (let index = 0; index < assignedTo.length; index++) {
        let name = assignedTo[index];
        let parts = name.split('_')
        let initials = ''
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].length > 0 && parts[i] !== '') {
                initials += parts[i][0]
            }
        }
        document.getElementById("assignedTo#" + taskIndex).innerHTML += renderInitials(taskIndex, initials);
    }
    assignedTo = [];
}

function getAssignedToVariants(taskIndex) {
    if (assignedToVariants.find(({ assigned_to }) => assigned_to == tasks[taskIndex].assigned_to)) {
        let searchWord = tasks[taskIndex].assigned_to;
        let assignedToVariantsIndex = assignedToVariants.findIndex(v => v.assigned_to === searchWord);
        document.getElementById("assignedToInitial#" + taskIndex).classList.add(assignedToVariants[assignedToVariantsIndex].variant)
    } else {
        assignedToVariants.push({
            variant: colorVariants[assignedToVariants.length],
            assigned_to: tasks[taskIndex].assigned_to,
        })
        if (document.getElementById("assignedToInitial#" + taskIndex) != null) {
            document.getElementById("assignedToInitial#" + taskIndex).classList.add(colorVariants[assignedToVariants.length - 1]);
        }

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

function startDragging(id) {
    currentId = id;
}

function moveTo(status) {
    tasks[currentId].status = status
    clearBoardTable();
    renderTasks();
    currentTaskPath = BASE_URL + "tasks/" + Object.keys(taskResponse)[currentId] + "/status";
    putData(currentTaskPath , status)
}

function dragoverHandler(ev) {
    ev.preventDefault();
}