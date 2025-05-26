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
    return `<div id="${subtask}" >
                <div onmouseover="openSubtaskEdit(${subtask})" onmouseout="closeSubtaskEdit(${subtask})"  class="subtask-list-container">
                    <li ondblclick="editSubtask(${subtask})" id="li-${subtask}">${subtask}</li>
                    <div id="edit-${subtask}" class="d_none subtasks-icon-container">
                        <img onclick="removeSubtask(${subtask})" class="delte-icon" src="../assets/icons/delete.png"alt="X">
                        <img src="../assets/icons/vector.png" alt="">
                        <img onclick="editSubtask(${subtask})" class="check-icon" src="../assets/icons/edit-v2.png" alt="Add">
                    </div>
                </div>
            </div>`
}