function renderTaskOverlay(taskIndex) {
    return `
        <div id="cardOverlay" class="cardOverlay">
            <div id="taskOverlayCategory${"#" + taskIndex}" class="taskOverlayCategory">${tasks[taskIndex].category}</div>
            <div id="taskOverlayName" class="taskOverlayName">${tasks[taskIndex].name}</div>
            <div id="taskOverlayDescription" class="taskOverlayDescription">${tasks[taskIndex].description}</div>
            <div id="overlaySubtasks${"#" + taskIndex}" class="overlaySubtasks">
                <div id="outerScaleOverlay${"#" + taskIndex}" class="outerScaleOverlay">
                    <div class="innerScaleOverlay" id="innerScaleOverlay${"#" + taskIndex}"></div>
                </div>
                <p id="subtaskOverlayDone${"#" + taskIndex}" class="subtaskOverlayDone"></p>
            </div>
            <div id="taskOverlayAssignment" class="taskOverlayAssignment">
                <div id="assignedToOverlay${"#" + taskIndex}" class="assignedToOverlay"></div>
                <div id="priorityOverlay${"#" + taskIndex}" class="priorityOverlay"></div>
            </div>
        </div>
    `;
}