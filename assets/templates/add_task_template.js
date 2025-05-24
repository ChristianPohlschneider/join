function assigneeDropdownTemplate(shortName, userName) {
    return `<div value="${shortName}">${shortName}<input type="checkbox" onclick="addMember('${shortName}', this, '${userName}')"></div>`;
}

function disabledSelect() {
    return `<option value="" disabled selected hidden>Select contacts to assign</option>`;
}

function meberTemplate(shortName) {
    return `<p id="member-${shortName}">${shortName}</p>`
}

function subtaskTemplate(subtask) {
    return `<div onmouseover="openSubtaskEdit()" onmouseout="closeSubtaskEdit()" class="subtask-list-container">
                <li>${subtask}</li>
                <div class="d_none subtasks-icon-container">
                    <img class="delte-icon" src="../assets/icons/delete.png"alt="X">
                    <img src="../assets/icons/vector.png" alt="">
                    <img class="check-icon" src="../assets/icons/edit-v2.png" alt="Add">
                </div>
            </div>`
}