function assigneeDropdownTemplate(shortName, userName) {
    return `<div value="${shortName}">${shortName}<input type="checkbox" onclick="addMember('${shortName}', this, '${userName}')"></div>`;
}

function disabledSelect() {
    return `<option value="" disabled selected hidden>Select contacts to assign</option>`;
}

function meberTemplate(shortName) {
    return `<p id="member-${shortName}">${shortName}</p>`
}

function subtaskTemplate(index) {
    return `<div id="${index}">
                <div onmouseover="openSubtaskEdit(${index})" onmouseout="closeSubtaskEdit(${index})"  class="subtask-list-container">
                    <li>${subtaskArr[index]}</li>
                    <div id="${subtaskArr[index]}-${index}" class="d_none subtasks-icon-container">
                        <img onclick="removeSubtask(${index})" class="delte-icon" src="../assets/icons/delete.png"alt="X">
                        <img src="../assets/icons/vector.png" alt="">
                        <img onclick="editSubtask(${index})" class="check-icon" src="../assets/icons/edit-v2.png" alt="Add">
                    </div>
                </div>
            </div>`
}