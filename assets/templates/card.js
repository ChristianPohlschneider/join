function renderCard(taskIndex) {
    return `
        <div id="card" class="card taskCard">
            <div id="taskCategory${"#" + taskIndex}" class="taskCategory">${tasks[taskIndex].category}</div>
            <div id="taskName" class="taskName">${tasks[taskIndex].name}</div>
            <div id="taskDescription" class="taskDescription">${tasks[taskIndex].description}</div>
            <div id="subtasks${"#" + taskIndex}" class="subtasks">
                <div id="outerscale" class="outerScale">
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

// function renderSubtasksScale(taskIndex) {
//     return `
//     <div id="subtasks" class="subtasks">
//         <div id="outerscale" class="outerScale">
//             <div class="innerScale" id="innerScale${statIndex}" style="width: ${Math.abs(Number(data.stats[statIndex].base_stat) * 3)}px"></div>
//         </div>
//         <p id="subtaskDone" class="subtaskDone">${"/" + tasks[taskIndex].subtasks.length + "Subtasks"}</p>
//     </div>
//     `;
// }