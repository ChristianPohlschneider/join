const contacts = {};
let priority = "medium"

function startForm() {
    addCss('medium');
    renderSelection();
}

function addNewToDO() {
    title = document.getElementById("title").value;
    description = document.getElementById("description").value;
    dueDate = document.getElementById("dueDate").value;
    category = document.getElementById("category").value;
    assignedTo = document.getElementById("assigned").value;
    //subtasks = document.getElementById("subtasks").value;

    tasks.push({
        assigned_to: assignedTo,
        category: category,
        date: dueDate,
        description: description,
        name: title,
        priority: priority,
        status: "todo",
        //subtasks:
    })
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
    addCss('medium')
}

function renderSelection() {
    const assignedTo = document.getElementById("assigned");
    assignedTo.innerHTML = "";

    assignedTo.innerHTML += `<option value="" disabled selected hidden>Select contacts to assign</option>`;

    for (let i = 0; i < users.length; i++) {
        assignedTo.innerHTML += `<option value="${users[i].name}">${users[i].name}</option>`;
    }
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