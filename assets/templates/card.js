function renderCard(taskIndex) {
    return `
        <div id="card" class="card taskCard">
            <div id="taskCategory${"#" + taskIndex}" class="taskCategory">${tasks[taskIndex].category}</div>
            <div id="taskName" class="taskName">${tasks[taskIndex].name}</div>
            <div id="taskDescription" class="taskDescription">${tasks[taskIndex].description}</div>
            <div id="subtasks${"#" + taskIndex}" class="subtasks">
                <div id="outerScale${"#" + taskIndex}" class="outerScale">
                    <div class="innerScale" id="innerScale${"#" + taskIndex}"></div>
                </div>
                <p id="subtaskDone${"#" + taskIndex}" class="subtaskDone"></p>
            </div>
            <div>
                <div id="assignedTo${"#" + taskIndex}" class="assignedTo"></div>
                <div id="priority" class="priority"></div>
            </div>
        </div>
    `;
}
