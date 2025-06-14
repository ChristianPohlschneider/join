let priority = "medium"
const submitButton = document.getElementById("creatTask");
let assignedMembers = [];
dueDate.min = new Date().toISOString().split("T")[0];
let subtaskArr = [];

async function startForm() {
    addCss('medium');
    fetchInit();
}

function addNewToDO() {
    title = document.getElementById("title").value;
    description = document.getElementById("description").value;
    dueDate = document.getElementById("dueDate").value;
    category = document.getElementById("category").value;
    pushTask(title, description, dueDate, category, priority);
    cancelTask();
    succeedRegistration();
    const Timeout = setTimeout(fowarding, 2000);
};

function cancelTask() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById('category').value = "";
    document.getElementById("memberForTask").innerHTML = "";
    document.getElementById("subtask").value = "";
    subtaskList.innerHTML = "";
    submitButton.disabled = true;
    addCss('medium');
    assignedMembers = [];
};

function pushTask(title, description, dueDate, category, priority) {
    let newTask = ({
        assigned_to: assignedMembers,
        category: category,
        date: dueDate,
        description: description,
        name: title,
        priority: priority,
        status: "toDo",
        subtasks: getSubTasks()
    });
    postData(newTask);
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

function addSubtask() {
    subtask = document.getElementById("subtask");
    if (subtask.value.trim()) {
        subtaskArr.push(subtask.value);
        renderSubtasks();
        subtask.value = "";
    }
    checkSubtask();
};

function renderSubtasks() {
    subtaskList.innerHTML = "";
    for (let index = 0; index < subtaskArr.length; index++) {
        subtaskList.innerHTML += subtaskTemplate(index);
    };
};

function getSubTasks() {
    const div = document.getElementById("subtaskList");
    if (div.children.length === 0) { return []; }
    const subtasks = Array.from(div.children).map(child => ({
        title: child.textContent.trim(),
        done: false
    }));
    return subtasks;
};

document.addEventListener("DOMContentLoaded", function () {
    const title = document.getElementById("title");
    const dueDate = document.getElementById("dueDate");
    const category = document.getElementById("category");
    function checkInputs() {
        if (title.value.trim() === "" || dueDate.value.trim() === "" || category.value.trim() === "") {
            submitButton.disabled = true;
        } else { submitButton.disabled = false; }
    }
    title.addEventListener("input", checkInputs);
    dueDate.addEventListener("input", checkInputs);
    category.addEventListener("input", checkInputs);
    checkInputs();
});

fetchInit().then(() => { getContacts(); });

function getContacts() {
    const contentPlace = document.getElementById("assigned");
    contentPlace.innerHTML = "";
    contentPlace.innerHTML += disabledSelect();
    const userNames = contacts.map(u => u.name);
    const shortNames = makeShortName(userNames);
    for (let i = 0; i < contacts.length; i++) {
        contentPlace.innerHTML += assigneeDropdownTemplate(shortNames[i], i);
        getBackgroundColor(i);
    };
};

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

function toggleSelectable() {
    let dropdownIcon = document.getElementById('dropwdown-icon');
    let selectableRef = document.getElementById("assigned");
    if (selectableRef.classList.contains('dnone')) {
        dropdownIcon.src = `../assets/icons/dropdown-open.png`
    } else {
        dropdownIcon.src = `../assets/icons/dropdown-closed.png`
    };
    selectableRef.classList.toggle("dnone");
};

function findSameBgColor(initals,fullname, index) {
    const findSameInitials = contacts.find((item) => { return item.name == fullname[index] });
    document.getElementById('picked-' + index).style.backgroundColor = findSameInitials.color;
};

function addMember(index ,shortName, userName) {
    const currentMember = assignedMembers.find((member) => { return member == userName });
    let bgcolor = document.getElementById("container-" + index);
    let checked = document.getElementById("img-" + index);
    if (currentMember) {
        const index = assignedMembers.indexOf(userName);
        assignedMembers.splice(index, 1);
        bgcolor.classList.remove('assigned-bgcolor');
        checked.src = `../assets/icons/checkbox.png`
        renderMembersForTask();
    } else {
        assignedMembers.push(userName);
        bgcolor.classList.add('assigned-bgcolor');
        checked.src = `../assets/icons/checkbox-checked-white.png`
        renderMembersForTask();
    };
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

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('assignee-input');
    searchInput.addEventListener('input', filterAssigned);
});

function filterAssigned(event) {
    const searchTerm = event.target.value.toLowerCase();
    const assigned = document.querySelectorAll('.selectable-assigned-contact');
    assigned.forEach(contact => {
        const content = contact.innerText.toLowerCase();
        contact.style.display = content.includes(searchTerm) ? 'flex' : 'none';
    });
};


function checkTitle() {
    let title = document.getElementById('title');
    let warningText = document.getElementById('warning-title');
    if (title.value.length <= 0) {
        getRedBorder(title);
    } else {
        title.classList.remove('red-border');
        warningText.classList.add('d_none');
    };
};

function checkDate() {
    let date = document.getElementById('dueDate');
    let warningText = document.getElementById('warning-dueDate');
    if (date.value === '') {
        getRedBorder(date);
    } else {
        date.classList.remove('red-border');
        warningText.classList.add('d_none');
    };
};

function getRedBorder(input) {
    input.classList.add('red-border');
    let warningText = document.getElementById('warning-' + input.id);
    warningText.classList.remove('d_none');
};

function checkCategory() {
    let category = document.getElementById('category');
    let warningText = document.getElementById('warning-category');
    if (category.value === '') {
        getRedBorder(category);
    } else {
        category.classList.remove('red-border');
        warningText.classList.add('d_none');
    };
};

function checkSubtask() {
    let subtaskRef = document.getElementById('subtask');
    let subtaskPlus = document.getElementById('subtask-plus');
    let subtaskIcons = document.getElementById('subtask-icon-container');
    if (subtaskRef.value.length > 0) {
        subtaskPlus.classList.add('d_none');
        subtaskIcons.classList.remove('d_none');
    } else {
        subtaskPlus.classList.remove('d_none');
        subtaskIcons.classList.add('d_none');
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
    renderSubtasks();
};

function editSubtask(index) {
    let currentListItem = document.getElementById("subtask-"+index);
    currentListItem.innerHTML = "";
    currentListItem.innerHTML = editSubtaskTemplate(index);
};

function addEditSubtask(index) {
    let editInput = document.getElementById('edit-input');
    subtaskArr[index] = editInput.value;
    renderSubtasks();
};

document.addEventListener('click', e => {
    let assignInput = document.getElementById('assignee-container');
    let assignedRef = document.getElementById('assigned');
    if (!assignedRef.contains(e.target) && e.target !== assignInput) {
        assignedRef.classList.add('dnone');
    };
});

function succeedRegistration() {
    let succeed = document.getElementById('succedSignup');
    succeed.classList.remove('d_none');
    document.getElementById('body').style.overflow = "hidden";
};

function fowarding() {
    window.location.href = "./board.html";
};