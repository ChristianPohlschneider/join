function loadTaskOverlayData(taskIndex) {
    findBackgroundColor(taskIndex);
    getOverlaySubtasks(taskIndex);
    getAssignedTo(taskIndex);
    getPriority(taskIndex);
}

function getOverlaySubtasks(taskIndex) {
    if (tasks[taskIndex].subtasks === undefined) {
            document.getElementById("subtasks#" + taskIndex).style.display = "none";
    }
    getSubtaskIndex(taskIndex);
    for (let subtaskIndex = 0; subtaskIndex < subtaskArray.length; subtaskIndex++) {
        if (subtaskArray[subtaskIndex].done == true) {
            // check checkbox
            // render subtask
            document.getElementById("subtasks#" + taskIndex).innerHTML += renderOverlaySubtasks(taskIndex, subtaskIndex);
        } else {
            // uncheck checkbox
            // render subtask
            document.getElementById("subtasks#" + taskIndex).innerHTML += renderOverlaySubtasks(taskIndex, subtaskIndex);
        }
    }
    subtaskArray = [];
}
