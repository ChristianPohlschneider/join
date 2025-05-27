function renderTaskOverlay(taskIndex) {
    return `
        <div id="cardOverlay" class="cardOverlay">
            <div id="taskCategory${"#" + taskIndex}" class="taskOverlayCategory">${tasks[taskIndex].category}<div>&times;</div></div>
            <div id="taskName" class="taskOverlayName">${tasks[taskIndex].name}</div>
            <div id="taskDescription" class="taskOverlayDescription">${tasks[taskIndex].description}</div>
            <div id="subtasks${"#" + taskIndex}" class="overlaySubtasks">
                <div id="outerScale${"#" + taskIndex}" class="outerScaleOverlay">
                    <div class="innerScale" id="innerScaleOverlay${"#" + taskIndex}"></div>
                </div>
                <p id="subtaskDone${"#" + taskIndex}" class="subtaskOverlayDone"></p>
            </div>
            <div id="taskAssignment" class="taskOverlayAssignment">
                <div id="assignedTo${"#" + taskIndex}" class="assignedToOverlay"></div>
                <div id="priority${"#" + taskIndex}" class="priorityOverlay"></div>
            </div>
        </div>
    `;
}