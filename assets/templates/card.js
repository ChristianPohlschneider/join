function renderCard(taskIndex) {
    return `
        <div draggable="true" ontouchstart="startDragging(${taskIndex})" ondragstart="startDragging(${taskIndex})" ondragend="dragEnd(${taskIndex})" id="card${taskIndex}" class="card taskCard" onclick="openTaskOverlay(${taskIndex}, event)">
            <div id="taskCategory${"#" + taskIndex}" class="taskCategory">${tasks[taskIndex].category}</div>
            <div id="taskName" class="taskName">${tasks[taskIndex].name}</div>
            <div id="taskDescription" class="taskDescription">${tasks[taskIndex].description}</div>
            <div id="subtasks${"#" + taskIndex}" class="subtasks">
                <div id="outerScale${"#" + taskIndex}" class="outerScale">
                    <div class="innerScale" id="innerScale${"#" + taskIndex}"></div>
                </div>
                <p id="subtaskDone${"#" + taskIndex}" class="subtaskDone"></p>
            </div>
            <div id="taskAssignment" class="taskAssignment">
                <div id="assignedTo${"#" + taskIndex}" class="assignedTo"></div>
                <div id="priority${"#" + taskIndex}" class="priority"></div>
            </div>
        </div>
    `;
}

function renderPriority(taskIndex, priority) {
     return `
     <img id="priorityImg${"#" + taskIndex}" class="priorityImg" src="../assets/icons/${priority}.png" alt="priority">
     `;
}

function renderInitials(taskIndex, initials, index) {
     return `
     <div class="assignedToInitialDiv">
        <div id="assignedToInitial${"#" + initials + "#" + index +  "#" + taskIndex}" class="assignedToInitial">${initials.toUpperCase()}</div>
     </div>
     `;
}
