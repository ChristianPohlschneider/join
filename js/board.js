let colorVariants = ["variant1", "variant2", "variant3", "variant4", "variant5", "variant6", "variant7", "variant8", "variant9", "variant10", "variant11", "variant12", "variant13", "variant14", "variant15"]
let categoryVariants = [];
let subtaskArray = [];
let assignedTo = [];
let assignedToVariants = [];
let subtask = 0;
let subtaskTotal = 0;
let currentId;
let touchTimer = null;
let touchStartTime = 0;
let hasStartedDragging = false;
let canStartDrag = false;
let hasMoved = false;

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
            renderTaskToDo(taskIndex, contacts);}
        else if (tasks[taskIndex].status == "inProgress") {
            renderTaskInProgress(taskIndex, contacts);}
        else if (tasks[taskIndex].status == "await") {
            renderTaskAwait(taskIndex, contacts);}
        else if (tasks[taskIndex].status == "done") {
            renderDone(taskIndex, contacts);}
    }
    renderDropZones();
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
 * This function renders the dropzones for the moved cards
 */
function renderDropZones() {
    document.getElementById("taskToDo").innerHTML += renderDropZone("dropzone#TaskToDo");
    document.getElementById("taskInProgress").innerHTML += renderDropZone("dropzone#TaskInProgress");
    document.getElementById("taskAwaitFeedback").innerHTML += renderDropZone("dropzone#TaskAwaitFeedback");
    document.getElementById("taskDone").innerHTML += renderDropZone("dropzone#TaskDone");
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
    }}

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
function getAssignedTo(taskIndex, contacts, full) {
    getAssignedToInitials(taskIndex, contacts, full);
}

/**
 * This function prepares the finding of the initial letters from each assigned 
 * contact and pushes them into the assignedTo array
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function getAssignedToInitials(taskIndex, contacts, full) {
    if (tasks[taskIndex].assigned_to) {
        for (const [key, value] of Object.entries(tasks[taskIndex].assigned_to)) {
            let nameValue = value;
            assignedTo.push(`${nameValue}`);
        };
        establishInitials(taskIndex, contacts, full);
        assignedTo = [];
    } else {
        return
    };
}

/**
 * This function finds the initial letters from each assigned contact and renders them
 * in the task card
 * 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {array} contacts - This is the array in which all contacts are pushed 
 */
function establishInitials(taskIndex, contacts, full) {
    const contentPlace = document.getElementById("taskAssignment" + taskIndex);
    for (let index = 0; index < assignedTo.length; index++) {
        if (index == 5 && !full) {
            contentPlace.innerHTML = moreMemberCardTemplate(); return}
        let name = assignedTo[index];
        let parts = name.split(' ');
        let initials = '';
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].length > 0 && parts[i] !== '') {
                initials += parts[i][0]}}
        document.getElementById("assignedTo#" + taskIndex).innerHTML += renderInitials(taskIndex, initials, index);
        getAssignedToVariants(taskIndex, initials, index, contacts);
    }}

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
    let nameToFind = Object.entries(tasks[taskIndex].assigned_to)[index][1];
    if (contacts.find(({ name }) => name == nameToFind)) {
        establishKnownVariant(taskIndex, initials, index);
    } else {
        document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).style.backgroundColor = getRandomColor();
        if (index != 0) {
            document.getElementById("assignedToInitial#" + initials + "#" + index + "#" + taskIndex).classList.add("positionAddInitials");
        }
    }
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
    let colorIndex = contacts.findIndex(v => v.name === searchWord);
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

/**
 * This function start the card dragging and rotates the card. It shows a visible dropzone
 * for the dragged card and scrolls to the end of the tasklist.
 * 
 * @param {number} id - This is the id from the dragged task from the tasks array
 * @returns - If there is no card, the function stops with return
 */
function startDragging(id) {
    currentId = id;
    const card = document.getElementById(`card${currentId}`);
    if (!card) return;
    if (!card.dataset.dragListenerAdded) {
        card.addEventListener('dragstart', function (e) {
            e.preventDefault();
        });
        card.dataset.dragListenerAdded = "true";}
    card.style.transformOrigin = 'bottom left';
    card.style.transform = 'rotate(3deg)';
    showVisibleFeedbackOnDrag(currentId);
    scrollDropzoneIntoView();
}

/**
 * This function ends the card dragging and rotates the card to its original value.
 * It hides the visible dropzone for the dragged card and the tasklist scrolls back.
 * 
 * @param {number} taskIndex - This is the index number from the tasks array
 */
function dragEnd(taskIndex) {
    const card = document.getElementById(`card${taskIndex}`);
    if (card) {
        card.style.transform = 'rotate(0deg)';
    }
    scrollElementsLeft();
    hideVisibleFeedbackOnDrag();
}

/**
 * This function saves the current task card status, fetches it and renders the changed tasks 
 * 
 * @param {string} status - This function needs the task from the task array
 */
async function moveTo(status) {
    tasks[currentId].status = status;
    currentTaskPath = BASE_URL + "tasks/" + Object.keys(taskResponse)[currentId] + "/status";
    await putData(currentTaskPath, status);
    await fetchContacts();
    clearBoardTable();
    renderTasks(contacts);
}

/**
 * This function allows a drop-event in the current browser
 * 
 * @param {object} ev - This parameter is the drag event
 */
function dragoverHandler(ev) {
    ev.preventDefault();
}

/**
 * This function shows visible feedback at the end of a tasklist while dragging
 * 
 * @param {number} currentId - This is the id from the dragged task from the tasks array
 */
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

/**
 * This function scrolls the tasklist back to the first task
 */
function scrollElementsLeft() {
    const containers = document.getElementsByClassName("taskList");
    for (const container of containers) {
        container.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
}

/**
 * This function scrolls the visible feedback element called dropzone into view
 */
function scrollDropzoneIntoView() {
    const containers = document.getElementsByClassName("taskList");
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

/**
 * This function toggles the classes of the visible feedback of the To do tasklist
 * to see the feedback while dragging
 */
function toggleVisibleFeedbackToDo() {
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
    document.getElementById("dropzone#TaskDone").classList.remove("d_none");
}

/**
 * This function toggles the classes of the visible feedback of the In progress tasklist
 * to see the feedback while dragging
 */
function toggleVisibleFeedbackInProgress() {
    document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
    document.getElementById("dropzone#TaskDone").classList.remove("d_none");
}

/**
 * This function toggles the classes of the visible feedback of the Await feedback tasklist
 * to see the feedback while dragging
 */
function toggleVisibleFeedbackAwait() {
    document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskDone").classList.remove("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none")
}

/**
 * This function toggles the classes of the visible feedback of the Done tasklist
 * to see the feedback while dragging
 */
function toggleVisibleFeedbackDone() {
    document.getElementById("dropzone#TaskToDo").classList.remove("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.remove("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.remove("d_none");
}

/**
 * This function is hiding the visible feedback on dragEnd
 */
function hideVisibleFeedbackOnDrag() {
    document.getElementById("dropzone#TaskToDo").classList.add("d_none");
    document.getElementById("dropzone#TaskInProgress").classList.add("d_none");
    document.getElementById("dropzone#TaskAwaitFeedback").classList.add("d_none");
    document.getElementById("dropzone#TaskDone").classList.add("d_none");
}

/**
 * This function enables the touch function for dragging on mobile devices with touch screen
 * 
 * @param {element} cardElement - This is the element which should be dragged
 * @param {number} taskIndex - This is the index number from the tasks array
 */
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

/**
 * This function adds the class "touched" to the card element
 * 
 * @param {element} cardElement - This is the element which should be dragged
 */
function addTouchedClass(cardElement) {
    cardElement.classList.add('touched');
}

/**
 * This function removes the class "touched" to the card element
 * 
 * @param {element} cardElement - This is the element which should be dragged 
 */
function removeTouchedClass(cardElement) {
    cardElement.classList.remove('touched');
}

/**
 * This function starts the drag function on touch
 * 
 * @param {element} cardElement - This is the element which should be dragged 
 * @param {DOMRect-Object} rect - This object specifies the position and the size of an object 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {number} offsetX - This is the x-position of the touch event 
 * @param {number} offsetY - This is the y-position of the touch event  
 */
function startDrag(cardElement, rect, taskIndex, offsetX, offsetY) {
    cardElement.style.position = 'absolute';
    cardElement.style.zIndex = 1000;
    cardElement.style.left = rect.left + window.pageXOffset + 'px';
    cardElement.style.top = rect.top + window.pageYOffset + 'px';
    cardElement.classList.add('dragging');
    document.body.appendChild(cardElement);
    cardElement.style.transformOrigin = 'bottom left';
    cardElement.style.transform = 'rotate(3deg)';
    showVisibleFeedbackOnDrag(taskIndex);
    scrollDropzoneIntoView();
}

/**
 * This function is used to move the card by touch hold
 * 
 * @param {element} cardElement - This is the element which should be dragged  
 * @param {object} ev - This is the touch event object
 * @param {number} offsetX - This is the x-position of the touch event 
 * @param {number} offsetY - This is the y-position of the touch event 
 */
function moveCard(cardElement, ev, offsetX, offsetY) {
    ev.preventDefault();
    const touch = ev.touches[0];
    const newLeft = touch.clientX + window.pageXOffset - offsetX;
    const newTop = touch.clientY + window.pageYOffset - offsetY;
    cardElement.style.left = newLeft + 'px';
    cardElement.style.top = newTop + 'px';
}

/**
 * This function is used to finish the drag on release of touch
 * 
 * @param {element} cardElement - This is the element which should be dragged  
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {object} ev - This is the touch event object 
 */
function finishDrag(cardElement, taskIndex, ev) {
    removeTouchedClass(cardElement);
    cardElement.classList.remove('dragging');
    dragEnd(taskIndex);
    const touch = ev.changedTouches[0];
    cardElement.style.pointerEvents = 'none';
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    cardElement.style.pointerEvents = '';
    const status = extractStatusFromDropTarget(dropTarget);
    if (status) {
        currentId = taskIndex;
        moveTo(status);
    } if (cardElement.parentElement === document.body) {cardElement.remove();}
}

/**
* This function handles the dragging process of the dragged card element
* 
* @param {element} cardElement - This is the element which should be dragged  
* @param {object} e - This is the touch event object  
* @param {number} taskIndex - This is the index number from the tasks array 
*/
function handleTouchStart(cardElement, e, taskIndex) {
    e.preventDefault();
    addTouchedClass(cardElement);
    const touch = e.touches[0];
    const rect = cardElement.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    setupDragHandlers(cardElement, touch, rect, offsetX, offsetY, taskIndex);
}

/**
 * This function is used to get the setup for the dragging process
 * 
 * @param {element} cardElement - This is the element which should be dragged 
 * @param {object} touch - This is the touch event object 
 * @param {DOMRect-Object} rect - This object specifies the position and the size of an object 
 * @param {number} offsetX - This is the x-position of the touch event  
 * @param {number} offsetY - This is the y-position of the touch event  
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
function setupDragHandlers(cardElement, touch, rect, offsetX, offsetY, taskIndex) {
    let dragStarted = false;
    let canDrag = false;
    const dragTimer = startDragTimer(() => canDrag = true, 300);
    const onMove = (ev) => {
        dragStarted = onTouchMove(ev, {
            dragStarted, canDrag, touch, cardElement, rect, taskIndex, offsetX, offsetY, dragTimer
        });};
    const onEnd = (ev) => {
        onTouchEnd(ev, {
            dragStarted, cardElement, onMove, onEnd, taskIndex, dragTimer});};
    cardElement.addEventListener('touchmove', onMove, { passive: false });
    cardElement.addEventListener('touchend', onEnd);
}

/**
 * This functin is used to move the element on touch
 * 
 * @param {object} ev - This is the touch event object 
 * @param {object} context - This is a container for the touch values
 * @returns the return value is true or false depending on touch state. if the drag event started
 *          previously, the return value is dragStarted
 */
function onTouchMove(ev, context) {
    const { dragStarted, canDrag, touch, cardElement, rect, taskIndex, offsetX, offsetY, dragTimer } = context;
    if (tryStartDrag(ev, { dragStarted, canDrag, touch, cardElement, rect, taskIndex, offsetX, offsetY, dragTimer }))
        return true;
    if (dragStarted) moveCard(cardElement, ev, offsetX, offsetY);
    return dragStarted;
}

/**
 * This function is used to handle the touch end
 * 
 * @param {object} ev - This is the touch event object 
 * @param {object} context - This is a container for the touch values 
 */
function onTouchEnd(ev, context) {
    const { dragStarted, cardElement, onMove, onEnd, taskIndex, dragTimer } = context;
    clearTimeout(dragTimer);
    cleanupListeners(cardElement, onMove, onEnd);
    removeTouchedClass(cardElement);
    if (!dragStarted) openTaskOverlay(taskIndex, ev);
    else finishDrag(cardElement, taskIndex, ev);
}

/**
 * This function is used to start the timer für the touch/drag event
 * 
 * @param {function} callback - This parameter is used to set the timer
 * @param {number} delay - This parameter controlls the timer delay
 * @returns - This function returns the setTimeout function
 */
function startDragTimer(callback, delay) {
    return setTimeout(callback, delay);
}

/**
 * This function adds the class "touched to the card"
 * 
 * @param {element} card - This is the element which should be dragged 
 */
function addTouchedClass(card) {
    card.classList.add('touched');
}

/**
 * This function removes the class "touched to the card"
 * 
 * @param {*element} card - This is the element which should be dragged 
 */
function removeTouchedClass(card) {
    card.classList.remove('touched');
}

/**
 * This function removes the event listeners from the card
 * 
 * @param {element} card - This is the element which should be dragged 
 * @param {object} onMove - This is the touch event on touchmove
 * @param {object} onEnd - This is the touch event on touchend 
 */
function cleanupListeners(card, onMove, onEnd) {
    card.removeEventListener('touchmove', onMove);
    card.removeEventListener('touchend', onEnd);
}

/**
 * This function is used to start the dragging, otherwise it returns false
 * 
 * @param {object} ev - This is the touch event object
 * @param {object} state - This is the status of the dragging process
 * @returns - This function returns false or true, depending on the dragged state
 */
function tryStartDrag(ev, state) {
    const moveTouch = ev.touches[0];
    const movedX = Math.abs(moveTouch.clientX - state.touch.clientX);
    const movedY = Math.abs(moveTouch.clientY - state.touch.clientY);
    if (!state.dragStarted && state.canDrag && (movedX > 5 || movedY > 5)) {
        clearTimeout(state.dragTimer);
        startDrag(state.cardElement, state.rect, state.taskIndex);
        return true;
    }
    return false;
}

/**
 * This function is used to start the dragging by touch
 * 
 * @param {element} card - This is the element which should be dragged  
 * @param {DOMRect-Object} rect - This object specifies the position and the size of an object  
 * @param {number} taskIndex - This is the index number from the tasks array 
 */
function startDrag(card, rect, taskIndex) {
    card.style.position = 'absolute';
    card.style.zIndex = 1000;
    card.style.left = rect.left + window.pageXOffset + 'px';
    card.style.top = rect.top + window.pageYOffset + 'px';
    card.classList.add('dragging');
    document.body.appendChild(card);
    card.style.transformOrigin = 'bottom left';
    card.style.transform = 'rotate(3deg)';
    showVisibleFeedbackOnDrag(taskIndex);
    scrollDropzoneIntoView();
}

/**
 * This function is used to move the card on touch event
 * 
 * @param {element} card - This is the element which should be dragged
 * @param {object} ev - This is the touch event object 
 * @param {number} offsetX - This is the x-position of the touch event  
 * @param {number} offsetY - This is the y-position of the touch event  
 */
function moveCard(card, ev, offsetX, offsetY) {
    ev.preventDefault();
    const touch = ev.touches[0];
    const newLeft = touch.clientX + window.pageXOffset - offsetX;
    const newTop = touch.clientY + window.pageYOffset - offsetY;
    card.style.left = newLeft + 'px';
    card.style.top = newTop + 'px';
}

/**
 * This function is used to finish the dragging process on touch event
 * 
 * @param {element} card - This is the element which should be dragged 
 * @param {number} taskIndex - This is the index number from the tasks array 
 * @param {object} ev - This is the touch event object 
 */
function finishDrag(card, taskIndex, ev) {
    card.classList.remove('dragging');
    dragEnd(taskIndex);
    const touch = ev.changedTouches[0];
    card.style.pointerEvents = 'none';
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    card.style.pointerEvents = '';
    const status = extractStatusFromDropTarget(dropTarget);
    if (status) {
        currentId = taskIndex;
        moveTo(status);
    }
    if (card.parentElement === document.body) card.remove();
}

/**
 * This function searches for the new status which the dragged element should get 
 * 
 * @param {HTMLElement} dropTarget - This is the target element of the dropped card
 * @returns - This function returns the new status which the dragged element should get
 */
function extractStatusFromDropTarget(dropTarget) {
    if (!dropTarget) return null;
    const boardList = dropTarget.closest('.boardList');
    if (!boardList) return null;
    const ondropAttr = boardList.getAttribute('ondrop');
    if (ondropAttr) {
        const match = ondropAttr.match(/moveTo\('([^']+)'\)/);
        if (match) return match[1];
    }
    const headerText = boardList.querySelector('h3')?.innerText.trim();
    const map = getStatusMapping();
    return map[headerText] || null;
}

/**
 * This function is used to return the mapping status as an object
 * 
 * @returns - This function returs the mapping status as an object 
 */
function getStatusMapping() {
    return {
        "To do": "toDo",
        "In progress": "inProgress",
        "Await feedback": "await",
        "Done": "done"
    };
}
