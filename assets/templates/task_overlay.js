function renderTaskOverlay(taskIndex) {
    return `
        <div id="cardOverlay" class="cardOverlay">
            <div class="taskCategoryDiv"><div id="taskCategory${"#" + taskIndex}" class="taskOverlayCategory">${tasks[taskIndex].category}</div><div onclick="closeOverlay()">&times;</div></div>
            <div id="taskName" class="taskOverlayName">${tasks[taskIndex].name}</div>
            <div id="taskDescription" class="taskOverlayDescription">${tasks[taskIndex].description}</div>
            <div class="dueDateOverlay">   
                <p>Due date:</p>
                <div>${tasks[taskIndex].date}</div>
            </div>
            <div class="priorityOverlay">
                <p>Priority:</p>
                <div id="priority${"#" + taskIndex}"></div>
            </div>
            <div id="taskAssignment" class="taskOverlayAssignment">
                <p>Assigned To:</p>
                <div id="assignedTo${"#" + taskIndex}" class="assignedToOverlay"></div>
            </div>
            <p id="subTaskHeadTitle">Subtasks</p>
            <div id="subtasks${"#" + taskIndex}" class="overlaySubtasks">

            </div>
        </div>
    `;
}

function renderOverlaySubtasks(taskIndex, subtaskIndex, subtaskCounter) {
    return `
        <input type="checkbox" name="" id="overlaySubtask${"#" + taskIndex + "#" + subtaskCounter}"></input>
        <div id="#" class="">${subtaskArray[subtaskIndex].title}</div>
    `;
}

function renderAssignedToName(assignedToNamesIndex) {
    const temp = document.createElement("div");
    temp.innerHTML = `
        <div class="" id="">${assignedToVariants[assignedToNamesIndex].assigned_to}</div>
    `;
    return temp.firstElementChild;
}