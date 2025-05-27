function renderTaskOverlay(taskIndex) {
    return `
        <div id="cardOverlay" class="cardOverlay">
            <div class="taskCategoryDiv"><div id="taskCategory${"#" + taskIndex}" class="taskOverlayCategory">${tasks[taskIndex].category}</div><div>&times;</div></div>
            <div id="taskName" class="taskOverlayName">${tasks[taskIndex].name}</div>
            <div id="taskDescription" class="taskOverlayDescription">${tasks[taskIndex].description}</div>
            <p>Due date:</p>
            <div class="priorityOverlay">
                <p>Priority:</p>
                <div id="priority${"#" + taskIndex}"></div>
            </div>
            <div id="taskAssignment" class="taskOverlayAssignment">
                <p>Assigned To:</p>
                <div id="assignedTo${"#" + taskIndex}" class="assignedToOverlay"></div>
            </div>
            <p>Subtasks</p>
            <div id="subtasks${"#" + taskIndex}" class="overlaySubtasks">

            </div>
        </div>
    `;
}

function renderOverlaySubtasks(taskIndex, subtaskIndex) {
    return `
        <input type="checkbox" name="" id="overlaySubtask${"#" + taskIndex + "#" + subtaskIndex}"></input>
    `;
}