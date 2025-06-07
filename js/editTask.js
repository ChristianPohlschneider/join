let assignedMembers = [];
let subtaskArr = [];

function editTaskOverlay(currentTask) {
    let overlayRef = document.getElementById('cardOverlay');
    overlayRef.innerHTML = "";
    overlayRef.innerHTML = editTaskOverlayTemplate(currentTask)
    addCss(tasks[currentTask].priority);
    getAssignedMembers(currentTask)
    renderMembersForTask()
    getContacts()
};

function addCss(id) {
    const elements = document.querySelectorAll('.selectable');
    elements.forEach(el => {
        el.classList.remove(el.id);
    });
    let clicked = document.getElementById(id);
    clicked.classList.add(id);
    addImage(id);
    priority = id;
};

function addImage(id) {
    switch (id) {
        case 'urgent':
            document.getElementById(id).innerHTML = `Urgent<img src="../assets/icons/urgent-white.png" alt="">`
            document.getElementById('low').innerHTML = `Low<img src="../assets/icons/low.png" alt="">`
            document.getElementById('medium').innerHTML = `Medium<img src="../assets/icons/medium.png" alt="">`
            break;
        case 'low':
            document.getElementById(id).innerHTML = `Low<img src="../assets/icons/low-white.png" alt="">`
            document.getElementById('medium').innerHTML = `Medium<img src="../assets/icons/medium.png" alt="">`
            document.getElementById('urgent').innerHTML = `Urgent<img src="../assets/icons/urgent.png" alt="">`
            break;
        case 'medium':
            document.getElementById(id).innerHTML = `Medium<img src="../assets/icons/medium-white.png" alt="">`
            document.getElementById('urgent').innerHTML = `Urgent<img src="../assets/icons/urgent.png" alt="">`
            document.getElementById('low').innerHTML = `Low<img src="../assets/icons/low.png" alt="">`
            break;
    };
};


function toggleSelectable() {
    let dropdownIcon = document.getElementById('dropwdown-icon');
    let selectableRef = document.getElementById("assigned");
    if (selectableRef.classList.contains('dnone')) {
        dropdownIcon.src = `../assets/icons/dropdown-open.png`
    } else {
        dropdownIcon.src = `../assets/icons/dropdown-closed.png`
    }
    selectableRef.classList.toggle("dnone");
};

function getContacts() {
    const contentPlace = document.getElementById("assigned");
    contentPlace.innerHTML = "";
    contentPlace.innerHTML += disabledSelect();
    const userNames = contacts.map(u => u.name);
    const shortNames = makeShortName(userNames);
    for (let i = 0; i < contacts.length; i++) {
        contentPlace.innerHTML += assigneeDropdownTemplate(shortNames[i], i);
        getBackgroundColor(i);
        checkSelectable(i)
    };
};

function checkSelectable(index) {
    const currentMember = assignedMembers.find((member) => { return member == replaceUmlauts(contacts[index].name) });
    let bgcolor = document.getElementById("container-" + index);
    let checked = document.getElementById("img-" + index);
    if (currentMember) {
        bgcolor.classList.add('assigned-bgcolor');
        checked.src = `../assets/icons/checkbox-checked-white.png`
    } else {
        return
    };
}

function getBackgroundColor(index) {
    document.getElementById(index).style.backgroundColor = contacts[index].color;
};

function makeShortName(userNames) {
    return userNames.map(name => {
        const parts = name.trim().split(" ");
        const first = parts[0]?.charAt(0).toUpperCase() || "";
        const last = parts[1]?.charAt(0).toUpperCase() || "";
        return first + last;
    });
};

function renderMembersForTask() {
    const contentPlace = document.getElementById("memberForTask");
    contentPlace.innerHTML = "";
    const initialsMembers = makeShortName(assignedMembers);
    for (let index = 0; index < assignedMembers.length; index++) {
        contentPlace.innerHTML += meberTemplate(initialsMembers, index);
        findSameBgColor(initialsMembers, assignedMembers, index);
    };
};

function getAssignedMembers(currentTask) {
    for (const [key, value] of Object.entries(tasks[currentTask].assigned_to)) {
        assignedMembers.push(`${value}`);
    }
    return assignedMembers;

}

function findSameBgColor(initals, fullname, index) {
    const findSameInitials = contacts.find(({ name }) => { return replaceUmlauts(name) == fullname[index] });
    document.getElementById('picked-' + index).style.backgroundColor = findSameInitials.color;
};

function addMember(index, shortName, userName) {
    const currentMember = assignedMembers.find((member) => { return member == replaceUmlauts(userName) });
    let bgcolor = document.getElementById("container-" + index);
    let checked = document.getElementById("img-" + index);
    if (currentMember) {
        const index = assignedMembers.indexOf(replaceUmlauts(userName));
        assignedMembers.splice(index, 1);
        bgcolor.classList.remove('assigned-bgcolor');
        checked.src = `../assets/icons/checkbox.png`
        renderMembersForTask();
    } else {
        replaceUmlauts(userName)
        assignedMembers.push(replaceUmlauts(userName));
        bgcolor.classList.add('assigned-bgcolor');
        checked.src = `../assets/icons/checkbox-checked-white.png`
        renderMembersForTask();
    };
};


function checkSubtask() {
    let subtaskRef = document.getElementById('subtask');
    let subtaskPlus = document.getElementById('subtask-plus');
    let subtaskIcons = document.getElementById('subtask-icon-container');
    if (subtaskRef.value.length > 0) {
        subtaskPlus.classList.add('hidden');
        subtaskIcons.classList.remove('hidden');
    } else {
        subtaskPlus.classList.remove('hidden');
        subtaskIcons.classList.add('hidden');
    };
};

function addSubtask() {
    subtask = document.getElementById("subtask");
    if (subtask.value.trim()) {
        subtaskArr.push(subtask.value);
        renderSubtasksEdit();
        subtask.value = "";
    }
    checkSubtask();
};

function renderSubtasksEdit() {
    subtaskList.innerHTML = "";
    for (let index = 0; index < subtaskArr.length; index++) {
        subtaskList.innerHTML += subtaskTemplate(index);
    };
};

function deleteSubtaskInput() {
    let subtaskRef = document.getElementById('subtask');
    subtaskRef.value = "";
    checkSubtask();
};

function openSubtaskEdit(index) {
    let subtaskEdit = document.getElementById(subtaskArr[index] + "-" + index);
    subtaskEdit.classList.remove('d_none');
};

function closeSubtaskEdit(index) {
    let subtaskEdit = document.getElementById(subtaskArr[index] + "-" + index);
    subtaskEdit.classList.add('d_none');
};

function removeSubtask(index) {
    subtaskArr.splice(index, 1);
    renderSubtasksEdit();
};

function editSubtask(index) {
    let currentListItem = document.getElementById("subtask-"+index);
    currentListItem.innerHTML = "";
    currentListItem.innerHTML = editSubtaskTemplate(index)
}

function addEditSubtask(index) {
    let editInput = document.getElementById('edit-input');
    subtaskArr[index] = editInput.value;
    renderSubtasksEdit();
};

