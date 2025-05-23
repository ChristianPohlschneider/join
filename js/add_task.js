let priority = "medium"
const submitButton = document.getElementById("creatTask");
let assignedMembers = [];
dueDate.min = new Date().toISOString().split("T")[0];

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
    cancelTask()
}

function cancelTask() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById('category').value = "";
    document.getElementById("memberForTask").innerHTML = "";
    document.getElementById("subtask").value = "";
    subtaskList.innerHTML = "";
    submitButton.disabled = true;
    addCss('medium')
    assignedMembers = [];
}

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
    postData(newTask)
}


function addCss(id) {
    const elements = document.querySelectorAll('.selectable');
    elements.forEach(el => {
        el.classList.remove(el.id);
    });
    let clicked = document.getElementById(id);
    clicked.classList.add(id);
    addImage(id);
     priority = id;
}

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
    }
}

function addSubtask() {
    subtask = document.getElementById("subtask");

    if (subtask.value.trim()) {
        subtaskList.innerHTML += subtaskTemplate(subtask.value);
        subtask.value = "";
    }
}

function getSubTasks() {
    const div = document.getElementById("subtaskList");
    if (div.children.length === 0) { return []; }

    const subtasks = Array.from(div.children).map(child => ({
        title: child.textContent.trim(),
        done: false
    }));

    return subtasks;
}

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


async function postData(newTask) {
    let response = await fetch(BASE_URL + 'tasks' + '.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    });

    let responseData = await response.json();
    return responseData;
}

fetchInit().then(() => { getContacts(); });

function getContacts() {
    const contentPlace = document.getElementById("assigned");
    contentPlace.innerHTML = "";
    contentPlace.innerHTML += disabledSelect();

    const userNames = users.map(u => u.name);
    const shortNames = makeShortName(userNames);

    for (let i = 0; i < shortNames.length; i++) {
        contentPlace.innerHTML += assigneeDropdownTemplate(shortNames[i], userNames[i]);
    }
}

function makeShortName(userNames) {
    return userNames.map(name => {
        const parts = name.trim().split(" ");
        const first = parts[0]?.charAt(0).toUpperCase() || "";
        const last = parts[1]?.charAt(0).toUpperCase() || "";
        return first + last;
    });
}



function toggleSelectable() {
    document.getElementById("assigned").classList.toggle("dnone")
}

function addMember(shortName, checkboxElement, userName) {
    const contentPlace = document.getElementById("memberForTask");

    if (checkboxElement.checked) {
        if (!document.getElementById(`member-${shortName}`)) {
            contentPlace.innerHTML += meberTemplate(shortName);
            assignedMembers.push({ "name": userName, "shortName": shortName });
        }
    } else {
        const elem = document.getElementById(`member-${shortName}`);
        if (elem) { elem.remove(); }
        assignedMembers = assignedMembers.filter(member => member.shortName !== shortName);
    }
};

function checkValue() {
    let title = document.getElementById('title')
    let warningText = document.getElementById('warning-title')
    if (title.value.length <= 0) {
        getRedBorder(title)
    } else {
        title.classList.remove('red-border')
        warningText.classList.add('d_none')
    }
}

function checkDate() {
    let date = document.getElementById('dueDate')
    let warningText = document.getElementById('warning-dueDate')
    if (date.value === '') {
        getRedBorder(date)
    } else {
        date.classList.remove('red-border')
        warningText.classList.add('d_none')
    }
}

function getRedBorder(input) {
    input.classList.add('red-border')
    let warningText = document.getElementById('warning-' + input.id)
    warningText.classList.remove('d_none')
}


