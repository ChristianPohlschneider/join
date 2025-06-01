function renderTaskOverlay(taskIndex) {
    return `
        <div id="cardOverlay" class="cardOverlay">
            <div class="taskCategoryDiv"><div id="taskCategory${"#" + taskIndex}" class="taskOverlayCategory">${tasks[taskIndex].category}</div><div class="closeImg" onclick="closeOverlay()"></div></div>
            <div id="taskName" class="taskOverlayName">${tasks[taskIndex].name}</div>
            <div id="taskDescription" class="taskOverlayDescription">${tasks[taskIndex].description}</div>
            <div class="dueDateOverlay">   
                <p class="fontSize20">Due date:</p>
                <div class="dueDateOverlayDiv">${tasks[taskIndex].date}</div>
            </div>
            <div class="priorityOverlay">
                <p class="fontSize20">Priority:</p>
                <div id="priority${"#" + taskIndex}" class="priorityOverlayDiv"></div>
            </div>
            <div id="taskAssignment" class="taskOverlayAssignment">
                <p class="fontSize20">Assigned To:</p>
                <div id="assignedTo${"#" + taskIndex}" class="assignedToOverlay"></div>
            </div>
            <div id="subtasks${"#" + taskIndex}" class="overlaySubtasks">
                <p id="subTaskHeadTitle" class="subTaskHeadTitle">Subtasks</p>
            </div>
            <div class="editDeleteDiv">
                <img class="editDeleteImg" src="../assets/icons/delete.png" alt="delete">
                <div>Delete</div>
                <img class="editDeleteVector" src="../assets/icons/vector.png" alt="vector">
                <img class="editDeleteImg" src="../assets/icons/edit-v2.png" alt="edit">
                <div>Edit</div>
            </div>
        </div>
    `;
}

function renderOverlaySubtasks(taskIndex, subtaskIndex, subtaskCounter) {
    return `
        <div class="overlaySubtaskDiv">
            <label class="overlaySubtaskCheckbox">
            <input type="checkbox" name="" id="overlaySubtask${"#" + taskIndex + "#" + subtaskCounter}" class="overlaySubtaskInput"></input>
            <span class="overlaySubtaskCheckmark"></span>
            </label>
            <div id="#" class="">${subtaskArray[subtaskIndex].title}</div>
        </div>
    `;
}

function renderAssignedToName(assignedToNamesIndex, assignedToName) {
    const temp = document.createElement("div");
    temp.innerHTML = `
        <div class="assignedToName" id="assignedToName${"#" + assignedToNamesIndex}">${assignedToName}</div>
    `;
    return temp.firstElementChild;
}