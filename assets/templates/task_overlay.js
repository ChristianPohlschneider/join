function renderTaskOverlay(taskIndex) {
    return `
        <div id="cardOverlay" class="cardOverlay">
            <div class="taskCategoryDiv"><div id="taskCategory${"#" + taskIndex}" class="taskOverlayCategory">${tasks[taskIndex].category}</div><div class="closeImg" onclick="closeOverlay()"></div></div>
            <div id="taskName" class="taskOverlayName">${tasks[taskIndex].name}</div>
            <div id="taskDescription" class="taskOverlayDescription">${tasks[taskIndex].description}</div>
            <div class="dueDateOverlay">   
                <p class="fontSize20">Due date:</p>
                <div class="dueDateOverlayDiv">${tasks[taskIndex].date.slice(0,10).split('-').reverse().join('/')}</div>
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
                <div class="deleteSectionDiv" onclick="getTaskKey('${tasks[taskIndex].name}')">
                    <img class="editDeleteImg" src="../assets/icons/delete.png" alt="delete">
                    <div>Delete</div>
                </div>    
                <img class="editDeleteVector" src="../assets/icons/vector.png" alt="vector">
                <div class="editSectionDiv" onclick="editTaskOverlay(${taskIndex})">
                    <img class="editDeleteImg" src="../assets/icons/edit-v2.png" alt="edit">
                    <div>Edit</div>
                </div>    
            </div>
        </div>
    `;
}

function renderOverlaySubtasks(taskIndex, subtaskKey, subtaskCounter) {
    const subtask = tasks[taskIndex].subtasks[subtaskKey];
    const checkedAttr = subtask.done ? "checked" : "";

    return `
        <div class="overlaySubtaskDiv">
            <label class="overlaySubtaskCheckbox">
                <input 
                    type="checkbox" 
                    id="overlaySubtask#${taskIndex}#${subtaskCounter}" 
                    class="overlaySubtaskInput"
                    onchange="updateSubtaskStatus(${taskIndex}, '${subtaskKey}', this.checked)"
                    ${checkedAttr}
                >
                <span class="overlaySubtaskCheckmark"></span>
            </label>
            <div>${subtask.title}</div>
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

function editTaskOverlayTemplate(currentTask) {
    return `<form class="flex-center-task">
                <div class="first-container flex-gap flex-column">
                        <p>Title</p>
                        <input class="input-text" type="text" id="title"value="${tasks[currentTask].name}" required>
                        <p>Description</p>
                        <textarea class="input-text" id="description" rows="6" cols="50">${tasks[currentTask].description}</textarea>
                        <p>Due date</p>
                        <input value="${tasks[currentTask].date}" type="date" required class="input-text date-input" id="dueDate">
                        <p>Priority</p>
                        <div class="flex-center flex-gap">
                            <div class="selectable" id="urgent" onclick="addCss('urgent')">
                                Urgent
                                <img src="../assets/icons/urgent.png" alt="">
                            </div>
                            <div class="selectable" id="medium" onclick="addCss('medium')">
                                Medium
                                <img src="../assets/icons/medium.png" alt="">
                            </div>
                            <div class="selectable" id="low" onclick="addCss('low')">
                                Low
                                <img src="../assets/icons/low.png" alt="">
                            </div>
                        </div>
                    <div class="assign-dropdown-container">
                        <p>Assigned to</p>
                        <div class="dropdown" id="assignee-dropdown">
                            <div onclick="toggleSelectable(), event.stopPropagation()" id="assignee-container"
                                class="subtask-container">
                                <input class="input-subtask" type="text" id="assignee-input"
                                    placeholder="Select contacts to assign" autocomplete="off">
                                <div class="dropdown-img-container">
                                    <img id="dropwdown-icon" src="../assets/icons/dropdown-closed.png" alt="">
                                </div>
                            </div>
                            <div class="selectable-assigned dnone" id="assigned"></div>
                            <div class="memberForTask" id="memberForTask"></div>
                        </div>
                    </div>
                    <article class="flex-column">
                        <label for="category">Category</label>
                        <select value="${tasks[currentTask].category}" id="category" name="selection-category" class="input-text"
                            required>
                            <option value="Technical Task">Technical Task</option>
                            <option value="User Story">User Story</option>
                        </select>
                    </article>
                        <p>Subtasks</p>
                        <div class="subtask-container">
                            <input onkeyup="checkSubtask()" id="subtask" type="text" placeholder="Add new Subtask"
                                maxlength="30" name="subtaskTitle" class="input-subtask">
                            <div id="subtask-icon-container" class="d_none subtasks-icon-container">
                                <img onclick="deleteSubtaskInput()" class="delte-icon" src="../assets/icons/delete.png"
                                    alt="X">
                                <img src="../assets/icons/vector.png" alt="">
                                <img onclick="addSubtask()" class="check-icon" src="../assets/icons/check-black.png"
                                    alt="Add">
                            </div>
                            <img id="subtask-plus" src="../assets/icons/+.png" alt="+" class="plus-symbol">
                        </div>
                        <div id="subtaskList"></div>
                </div>
            </form>`
};