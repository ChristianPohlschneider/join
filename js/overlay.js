let subtaskCounter = 0;

function loadTaskOverlayData(taskIndex) {
    findBackgroundColor(taskIndex);
    getOverlaySubtasks(taskIndex);
    getAssignedTo(taskIndex);
    getAssignedToNames(taskIndex);
    getPriority(taskIndex);
    document.getElementById("priority#" + taskIndex).innerHTML += tasks[taskIndex].priority;
}

function openTaskOverlay(taskIndex, event) {
    document.getElementById("currentContent").innerHTML = "";
    document.getElementById("currentContent").innerHTML += renderTaskOverlay(taskIndex, subtaskCounter);
    loadTaskOverlayData(taskIndex);
    event.stopPropagation();
    document.body.classList.add("stopScrolling");
}

function getAssignedToNames(taskIndex) {
    let searchWord = Object.entries(document.getElementsByClassName("assignedToOverlay"))[0][1].children;
    for (let index = 0; index < searchWord.length; index++) {
        let assignedToNamesIndex = assignedToVariants.findIndex(v => v.initials === searchWord[index].innerHTML);
        searchWord[index].after(renderAssignedToName(assignedToNamesIndex));
        index++
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
}
