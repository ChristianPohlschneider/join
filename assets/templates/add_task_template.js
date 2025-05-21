function assigneeDropdownTemplate(shortName, userName) {
    return `<div value="${shortName}">${shortName}<input type="checkbox" onclick="addMember('${shortName}', this, '${userName}')"></div>`;
}

function disabledSelect() {
    return `<option value="" disabled selected hidden>Select contacts to assign</option>`;
}

function  meberTemplate(shortName){
    return `<p id="member-${shortName}">${shortName}</p>`
} 

function subtaskTemplate(subtask) {
    return `<li>${subtask}</li>`
}