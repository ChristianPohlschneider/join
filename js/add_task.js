let priority = "medium"
const submitButton = document.getElementById("creatTask");

async function startForm() {
    addCss('medium');
    fetchInit();
}

function addNewToDO() {
    title = document.getElementById("title").value;
    description = document.getElementById("description").value;
    dueDate = document.getElementById("dueDate").value;
    category = document.getElementById("category").value;
    assignedTo = document.getElementById("assigned").value;

    pushTask(title, description, dueDate, category, assignedTo, priority);
    cancelTask()
}

function cancelTask() {
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById('category').value = "";
    document.getElementById("assigned").value = "";
    document.getElementById("subtask").value = "";
    subtaskList.innerHTML = "";
    submitButton.disabled = true;
    addCss('medium')
}

function pushTask(title, description, dueDate, category, assignedTo, priority) {
    let newTask = ({
        assigned_to: assignedTo,
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
    const clicked = document.getElementById(id);

    clicked.classList.add(id);
    priority = id;
}

function addSubtask() {
    subtask = document.getElementById("subtask");

    if (subtask.value.trim()) {
        subtaskList.innerHTML += `<li>${subtask.value}</li>`;
        subtask.value = "";
    }
}

function getSubTasks() {
    const div = document.getElementById("subtaskList");
    if (div.children.length === 0) {
        return [];
    }

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
        } else {
            submitButton.disabled = false;
        }
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
    }
    );

    let responseData = await response.json();
    return responseData;
}

fetchInit().then(() => {
    console.log(users);
    getContacts();
});

function getContacts() {
    contentPlace = document.getElementById("assigned");
    contentPlace.innerHTML = "";
    contentPlace.innerHTML += `<option value="" disabled selected hidden>Select contacts to assign</option>`;

    const userNames = users.map(u => u.name);
    const shortNames = userNames.map(name => name.substring(0, 2));

    for (let i = 0; i < shortNames.length; i++) {
        contentPlace.innerHTML += `<option value="${shortNames[i]}">${shortNames[i]}</option>`;
    }
}  
