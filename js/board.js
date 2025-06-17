let colorVariants = ["variant1", "variant2", "variant3", "variant4", "variant5", "variant6", "variant7", "variant8", "variant9", "variant10", "variant11", "variant12", "variant13", "variant14", "variant15"]
let categoryVariants = [];
let subtaskArray = [];
let assignedTo = [];
let assignedToVariants = [];
let subtask = 0;
let subtaskTotal = 0;
let currentId;

/**
 * This function initializes the board.html and fetches the saved tasks and contacts
 */
async function initboard() {
    document.getElementById("menuTemplate").innerHTML = checkLogged();
    document.querySelector("header").innerHTML = header();
    initAvatarSlider();
    await fetchTasks();
    await fetchContacts();
    clearBoardTable();
    renderTasks(contacts);
    highlightLink();
}

/**
 * This function highlights the chosen link in the menu
 */
function highlightLink() {
    const currentLink = document.getElementById('board')
    currentLink.classList.add('activeLink');
};

/**
 * This function renders the actual fetched tasks
 * 
 * @param {array} contacts - This function uses the fetched contacts array to render and assign the tasks
 */
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

/**
 * This function clears the board table to render new content.
 */
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

/**
 * This function renders the "To do" tasks as a card template from card.js
 * and adds the task informations
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 * @param {array} contacts - This is the array in which all contacts are pushed
 */
function renderTaskToDo(taskIndex, contacts) {
    document.getElementById("emptyTask0").classList.remove("emptyTask");
    document.getElementById("emptyTask0").classList.add("d_none");
    const container = document.getElementById("taskToDo");
    container.insertAdjacentHTML("beforeend", renderCard(taskIndex));
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
    const cardElement = document.getElementById(`card${taskIndex}`);
    enableTouchDrag(cardElement, taskIndex);
}

/**
 * This function renders the "in progress" tasks as a card template from card.js
 * and adds the task informations
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 * @param {array} contacts - This is the array in which all contacts are pushed
 */
function renderTaskInProgress(taskIndex, contacts) {
    const empty = document.getElementById("emptyTask1");
    empty.classList.remove("emptyTask");
    empty.classList.add("d_none");
    const container = document.getElementById("taskInProgress");
    container.insertAdjacentHTML("beforeend", renderCard(taskIndex));
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
    const cardElement = document.getElementById(`card${taskIndex}`);
    enableTouchDrag(cardElement, taskIndex);
}

/**
 * This function renders the "Await feedback" tasks as a card template from card.js
 * and adds the task informations
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 * @param {array} contacts - This is the array in which all contacts are pushed
 */
function renderTaskAwait(taskIndex, contacts) {
    const empty = document.getElementById("emptyTask2");
    empty.classList.remove("emptyTask");
    empty.classList.add("d_none");
    const container = document.getElementById("taskAwaitFeedback");
    container.insertAdjacentHTML("beforeend", renderCard(taskIndex));
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
    const cardElement = document.getElementById(`card${taskIndex}`);
    enableTouchDrag(cardElement, taskIndex);
}

/**
 * This function renders the "Done" tasks as a card template from card.js
 * and adds the task informations
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function renderDone(taskIndex, contacts) {
    const empty = document.getElementById("emptyTask3");
    empty.classList.remove("emptyTask");
    empty.classList.add("d_none");
    const container = document.getElementById("taskDone");
    container.insertAdjacentHTML("beforeend", renderCard(taskIndex));
    findBackgroundColor(taskIndex);
    getSubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getPriority(taskIndex);
    const cardElement = document.getElementById(`card${taskIndex}`);
    enableTouchDrag(cardElement, taskIndex);
}


/**
 * This function finds the background color for the initials of the contacts, which are
 * assigned to the current task. If no contact is found, it pushes a new color-variant
 * in the categoryVariants array
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
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

/**
 * This function finds all subtasks from the current task
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
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
/**
 * This function renders the subtasks in the current task card
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
function renderSubtasks(taskIndex) {
    document.getElementById("subtaskDone#" + taskIndex).innerHTML = subtask + "/" + subtaskTotal + " Subtask";
    document.getElementById("innerScale#" + taskIndex).style.width = Math.abs(Number((subtask / subtaskTotal) * 128)) + "px";
    subtask = 0;
    subtaskTotal = 0;
    subtaskArray = [];
}

/**
 * This function saves all found subtasks from tasks[taskindex] in the subtaskArray
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 */
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


/**
 * This function finds the task priority and renders it into the task card
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
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


/**
 * This function calls the getAssignedTiInitials() function
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function getAssignedTo(taskIndex, contacts) {
    getAssignedToInitials(taskIndex, contacts);
}

/**
 * This function prepares the finding of the initial letters from each assigned 
 * contact and pushes them into the assignedTo array
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function getAssignedToInitials(taskIndex, contacts) {
    for (const [key, value] of Object.entries(tasks[taskIndex].assigned_to)) {
        let nameValue = replaceUmlauts(value);
        assignedTo.push(`${nameValue}`);
    }
    establishInitials(taskIndex, contacts);
    assignedTo = [];
}

/**
 * This function finds the initial letters from each assigned contact and renders them
 * in the task card
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
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

/**
 * This function is used to find the peviously saved color variant for the assigned contact
 * from the contacts array. Otherwise a random color will be assigned to the assigned initials 
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {string} initials - These are the found initials of the assigned people
 * @param {number} index - This is the index number from the assignedTo array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
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

/**
 * This function replaces umlauts from the assigned contact names for a better finding of the
 * initial color variants
 * 
 * @param {string} string - This string is the name of the current assigned contact
 * @returns - This functions returns the name of the assigned contact with replaced umlauts
 */
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

/**
 * This function establishes the found color variant from a known assigned contact
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {string} initials - These are the found initials of the assigned people 
 * @param {number} index - This is the index number from the assignedTo array 
 */
function establishKnownVariant(taskIndex, initials, index) {
    let searchWord = Object.entries(tasks[taskIndex].assigned_to)[index][1];
    let colorIndex = contacts.findIndex(v => replaceUmlauts(v.name) === replaceUmlauts(searchWord));
    document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).style.backgroundColor = contacts[colorIndex].color;
    if (index != 0) {
        document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).classList.add("positionAddInitials");
    }
}

/**
 * This function establishes a random color variant for an unknown contact
 * 
 * @returns - The function returns a random color code from the colors array
 */
function getRandomColor() {
    const colors = ["#6E52FF", "#FFA35E", "#FFE62B", "#00BEE8", "#FF5EB3", "#FFBB2B", "#FF745E", "#C3FF2B", "#FF7A00", "#1FD7C1", "#0038FF", "#FFC701", "#9327FF", "#FC71FF", "#FF4646"];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * This function listens to the search input field in the task board to find the wanted
 * task
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.taskSearchInput');
    searchInput.addEventListener('input', filterTasks);
});

/**
 * This function dynamically searches for tasks which fit to the input objects
 * 
 * @param {object} event - This is the search input object
 */
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
    const card = document.getElementById(`card${currentId}`);
    if (!card) return;
    card.style.transformOrigin = 'bottom left';
    card.style.transform = 'rotate(3deg)';
    showVisibleFeedbackOnDrag(currentId);
    scrollDropzoneIntoView();
}

function dragEnd(taskIndex) {
    const card = document.getElementById(`card${taskIndex}`);
    if (card) {
        card.style.transform = 'rotate(0deg)';
    }
    scrollElementsLeft();
    hideVisibleFeedbackOnDrag();
}

async function moveTo(status) {
    tasks[currentId].status = status;
    currentTaskPath = BASE_URL + "tasks/" + Object.keys(taskResponse)[currentId] + "/status";
    await putData(currentTaskPath, status);
    await fetchContacts();
    clearBoardTable();
    renderTasks(contacts);
}

function dragoverHandler(ev) {
    ev.preventDefault();
}

function showVisibleFeedbackOnDrag(currentId) {
    if (tasks[currentId].status == "toDo") {
        toggleVisibleFeedbackToDo();
    }
    if (tasks[currentId].status == "inProgress") {
        toggleVisibleFeedbackInProgress();
    }
    if (tasks[currentId].status == "await") {
        toggleVisibleFeedbackAwait();
    }
    if (tasks[currentId].status == "done") {
        toggleVisibleFeedbackDone();
    }
}

function scrollElementsLeft() {
    const containers = document.getElementsByClassName("taskFolder");
    for (const container of containers) {
        container.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
}

function scrollDropzoneIntoView() {
    const containers = document.getElementsByClassName("taskFolder");
    for (const container of containers) {
        const dropzone = container.querySelector(".dropzoneCard");
        if (dropzone) {
            const containerRect = container.getBoundingClientRect();
            const dropzoneRect = dropzone.getBoundingClientRect();
            const offsetRight = dropzoneRect.right - containerRect.right;
            if (offsetRight > 0) {
                container.scrollBy({ left: offsetRight, top: 0, behavior: 'smooth' });
            }
        }
    }
}

function toggleVisibleFeedbackToDo() {
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
    document.getElementById("dropzone#TaskDone").classList.remove("d_none");
}

function toggleVisibleFeedbackInProgress() {
    document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
    document.getElementById("dropzone#TaskDone").classList.remove("d_none");
}

function toggleVisibleFeedbackAwait() {
    document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskDone").classList.remove("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none")
}

function toggleVisibleFeedbackDone() {
    document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
}

function hideVisibleFeedbackOnDrag() {
    document.getElementById("dropzone#TaskToDo").classList.add("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.add("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.add("d_none");
    document.getElementById("dropzone#TaskDone").classList.add("d_none");
}

function enableTouchDrag(cardElement, taskIndex) {
    let offsetX = 0, offsetY = 0;
    cardElement.addEventListener('touchstart', (e) => {
        ({ offsetX, offsetY } = handleTouchStart(cardElement, e));
    });
    cardElement.addEventListener('touchmove', (e) => {
        handleTouchMove(cardElement, e, offsetX, offsetY);
    });
    cardElement.addEventListener('touchend', (e) => {
        handleTouchEnd(cardElement, taskIndex, e);
    });
}

function handleTouchStart(cardElement, e) {
    const touch = e.touches[0];
    const rect = cardElement.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    cardElement.style.position = 'absolute';
    cardElement.style.zIndex = 1000;
    cardElement.style.left = rect.left + scrollLeft + 'px';
    cardElement.style.top = rect.top + scrollTop + 'px';
    cardElement.classList.add('dragging');
    document.body.appendChild(cardElement);
    return { offsetX, offsetY };
}

function handleTouchMove(cardElement, e, offsetX, offsetY) {
    e.preventDefault();
    const touch = e.touches[0];
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const newLeft = touch.clientX + scrollLeft - offsetX;
    const newTop = touch.clientY + scrollTop - offsetY;
    cardElement.style.left = newLeft + 'px';
    cardElement.style.top = newTop + 'px';
}

function handleTouchEnd(cardElement, taskIndex, e) {
    cardElement.classList.remove('dragging');
    dragEnd(taskIndex);
    const touch = e.changedTouches[0];
    cardElement.style.pointerEvents = 'none';
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    cardElement.style.pointerEvents = '';
    const status = extractStatusFromDropTarget(dropTarget);
    if (status) {
        currentId = taskIndex;
        moveTo(status);}
    if (cardElement.parentElement === document.body) {
        cardElement.remove();
    }}

function extractStatusFromDropTarget(dropTarget) {
    if (!dropTarget) return null;
    const boardList = dropTarget.closest('.boardList');
    if (!boardList) return null;
    const ondropAttr = boardList.getAttribute('ondrop');
    if (ondropAttr) {
        const match = ondropAttr.match(/moveTo\('([^']+)'\)/);
        if (match) return match[1];}
    const headerText = boardList.querySelector('h3')?.innerText.trim();
    const map = {
        "To do": "toDo",
        "In progress": "inProgress",
        "Await feedback": "await",
        "Done": "done"};
    return map[headerText] || null;
}

function handleTouchDrop(touch) {
    const dropTargets = document.querySelectorAll('.boardList');
    for (const dropTarget of dropTargets) {
        const rect = dropTarget.getBoundingClientRect();
        if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        ) {
            const targetStatus = getStatusFromDropTarget(dropTarget);
            if (targetStatus) {
                moveTo(targetStatus);
            }
            break;
        }}}

function getStatusFromDropTarget(dropTarget) {
    if (dropTarget.innerHTML.includes("To do")) return "toDo";
    if (dropTarget.innerHTML.includes("In progress")) return "inProgress";
    if (dropTarget.innerHTML.includes("Await feedback")) return "await";
    if (dropTarget.innerHTML.includes("Done")) return "done";
    return null;
}