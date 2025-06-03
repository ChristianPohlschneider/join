let subtaskCounter = 0;

function loadTaskOverlayData(taskIndex) {
    findBackgroundColor(taskIndex);
    getOverlaySubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getAssignedToNames(taskIndex, contacts);
    getPriority(taskIndex);
    document.getElementById("priority#" + taskIndex).innerHTML += tasks[taskIndex].priority.charAt(0).toUpperCase() + tasks[taskIndex].priority.slice(1);
}

function openTaskOverlay(taskIndex, event) {
    document.getElementById("currentContent").innerHTML = "";
    document.getElementById("boardTaskOverlay").classList.remove("hidden");
    document.getElementById("currentContent").innerHTML += renderTaskOverlay(taskIndex, subtaskCounter);
    loadTaskOverlayData(taskIndex);
    event.stopPropagation();
    document.body.classList.add("stopScrolling");
}

function getAssignedToNames(taskIndex, contacts) {
    let searchWord = Object.entries(document.getElementsByClassName("assignedToOverlay"))[0][1].children;
    for (let index = 0; index < searchWord.length; index++) {
        let assignedToNamesIndex = contacts.findIndex(v => getInitialsOverlay(v.name) === searchWord[index].innerText);
        let assignedToName = "";
        editAssignedToName(assignedToNamesIndex, assignedToName, searchWord, index, contacts);
    }
}

function getInitialsOverlay(name) {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0].toUpperCase())
    .join('');
}

function editAssignedToName(assignedToNamesIndex, assignedToName, searchWord, index, contacts) {
    assignedToName = contacts[assignedToNamesIndex].name;
    establishRenderAssignedToName(assignedToNamesIndex, assignedToName, searchWord, index);
}

function establishRenderAssignedToName(assignedToNamesIndex, assignedToName, searchWord, index) {
        searchWord[index].children[0].after(renderAssignedToName(assignedToNamesIndex, assignedToName));
        if (index != 0) {
            searchWord[index].children[0].classList.remove("positionAddInitials");
        }
}

function getOverlaySubtasks(taskIndex) {
    if (tasks[taskIndex].subtasks === undefined) {
        document.getElementById("subtasks#" + taskIndex).style.display = "none";
        document.getElementById("subTaskHeadTitle").style.display = "none";
    }
    getSubtaskIndex(taskIndex);
    for (let subtaskIndex = 0; subtaskIndex < subtaskArray.length; subtaskIndex++) {
        document.getElementById("subtasks#" + taskIndex).innerHTML += renderOverlaySubtasks(taskIndex, subtaskIndex, subtaskCounter);
        subtaskCounter++
    }
    subtaskCounter = 0;
    checkSubtaskCheckboxes(taskIndex);
    subtaskArray = [];
}

function checkSubtaskCheckboxes(taskIndex) {
    for (let subtaskIndex = 0; subtaskIndex < subtaskArray.length; subtaskIndex++) {
        if (subtaskArray[subtaskIndex].done == true) {
            document.getElementById("overlaySubtask#" + taskIndex + "#" + subtaskCounter).checked = true;
            subtaskCounter++
        } else {
            document.getElementById("overlaySubtask#" + taskIndex + "#" + subtaskCounter).checked = false;
            subtaskCounter++
        }
    }
    subtaskCounter = 0;
}

function closeOverlay() {
    document.getElementById("currentContent").innerHTML = "";
    document.getElementById("boardTaskOverlay").classList.add("hidden");
}
