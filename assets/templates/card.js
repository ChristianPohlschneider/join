function renderCard(taskIndex) {
    return `
        <div id="card" class="card taskCard">
            <div id="taskCategory${"#" + taskIndex}" class="taskCategory">${tasks[taskIndex].category}</div>
            <div id="taskName" class="taskName">${tasks[taskIndex].name}</div>
            <div id="taskDescription" class="taskDescription">${tasks[taskIndex].description}</div>
            <div id="subtask" class="subtask">
                <div id="subtaskScale" class="subtaskScale"></div>
                <div id="subtaskCount" class="subtaskCount"></div>
            </div>
            <div>
                <div id="assignedTo${"#" + taskIndex}" class="assignedTo"></div>
                <div id="priority" class="priority"></div>
            </div>
        </div>
    `;
}

function renderSubtaskSScale(data, statIndex) {
    return `
    <div class="attribute"><p class="attributeName">${data.stats[statIndex].stat.name}</p>
        <div id="outerscale" class="outerScale">
            <div class="innerScale" id="innerScale${statIndex}" style="width: ${Math.abs(Number(data.stats[statIndex].base_stat) * 3)}px"></div>
        </div>
    </div>
    `;
}