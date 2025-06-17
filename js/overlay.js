let subtaskCounter = 0;
let isAddTaskOverlayOpen = false;
let isTaskOverlayOpen = false

function loadTaskOverlayData(taskIndex) {
    findBackgroundColor(taskIndex);
    getOverlaySubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getAssignedToNames(taskIndex, contacts);
    getPriority(taskIndex);
    document.getElementById("priority#" + taskIndex).innerHTML += tasks[taskIndex].priority.charAt(0).toUpperCase() + tasks[taskIndex].priority.slice(1);
}

function openTaskOverlay(taskIndex, event) {
    window.innerWidth <= 500 ? document.documentElement.classList.add('stopScrolling') : 'disabled'
    isTaskOverlayOpen = true
    document.getElementById("currentContent").innerHTML = "";
    document.getElementById("boardTaskOverlay").classList.remove("hidden");
    document.getElementById("currentContent").innerHTML += renderTaskOverlay(taskIndex, subtaskCounter);
    loadTaskOverlayData(taskIndex);
    document.getElementById("cardOverlay").style.transform = "translateX(0)";
    document.getElementById("cardOverlay").classList.add("openCardOverlay");
    event.stopPropagation();
}

function getAssignedToNames(taskIndex, contacts) {
    let searchWord = Object.entries(document.getElementsByClassName("assignedToOverlay"))[0][1].children;
    for (let index = 0; index < searchWord.length; index++) {
        let assignedToNamesIndex = contacts.findIndex(v => getInitialsOverlay(v.name) === searchWord[index].innerText);
        let assignedToName = "";
        editAssignedToName(assignedToNamesIndex, assignedToName, searchWord, index, contacts);
    }
}

function getInitialsOverlay(name) {
    return name
        .trim()
        .split(/\s+/)
        .map(word => word[0].toUpperCase())
        .join('');
}

function editAssignedToName(assignedToNamesIndex, assignedToName, searchWord, index, contacts) {
    if (!contacts[assignedToNamesIndex] || !contacts[assignedToNamesIndex].name) {
        alert("Contact is not registered yet!");
        return;
    }
    assignedToName = contacts[assignedToNamesIndex].name;
    establishRenderAssignedToName(assignedToNamesIndex, assignedToName, searchWord, index);
}

function establishRenderAssignedToName(assignedToNamesIndex, assignedToName, searchWord, index) {
    searchWord[index].children[0].after(renderAssignedToName(assignedToNamesIndex, assignedToName));
    if (index != 0) {
        searchWord[index].children[0].classList.remove("positionAddInitials");
    }
}

function getOverlaySubtasks(taskIndex) {
    const task = tasks[taskIndex];
    const subtasksObj = task.subtasks;
    const subtasksContainer = document.getElementById("subtasks#" + taskIndex);
    if (!subtasksContainer) {
        console.warn("Subtasks-Container nicht gefunden für Task", taskIndex);
        return;
    }
    if (!subtasksObj || typeof subtasksObj !== "object") {
        subtasksContainer.style.display = "none";
        document.getElementById("subTaskHeadTitle").style.display = "none";
        return;
    }
    const subtasksArray = Object.values(subtasksObj);
    subtasksContainer.innerHTML = "";
    for (let i = 0; i < subtasksArray.length; i++) {
        const subtask = subtasksArray[i];
        subtasksContainer.innerHTML += renderOverlaySubtasks(taskIndex, Object.keys(subtasksObj)[i], i);
    }
    checkSubtaskCheckboxes(taskIndex);
}

function checkSubtaskCheckboxes(taskIndex) {
    for (let subtaskIndex = 0; subtaskIndex < subtaskArray.length; subtaskIndex++) {
        if (subtaskArray[subtaskIndex].done == true) {
            document.getElementById("overlaySubtask#" + taskIndex + "#" + subtaskCounter).checked = true;
            subtaskCounter++
        } else {
            document.getElementById("overlaySubtask#" + taskIndex + "#" + subtaskCounter).checked = false;
            subtaskCounter++
        }
    }
    subtaskCounter = 0;
}

function closeOverlay() {
    document.documentElement.classList.remove('stopScrolling')
    document.getElementById("currentContent").innerHTML = "";
    document.getElementById("boardTaskOverlay").classList.add("hidden");
    isTaskOverlayOpen = false
}

async function deleteTaskByKey(key) {
    if (!confirm("Möchtest du diesen Task wirklich löschen?")) return;
    try {
        await fetch(`${BASE_URL}tasks/${key}.json`, {
            method: "DELETE"
        });
        closeOverlay();
        await fetchTasks();
        await fetchContacts();
        clearBoardTable();
        renderTasks(contacts);
    } catch (error) {
        console.error("Fehler beim Abrufen oder Löschen:", error);
    }
}

async function getTaskKey(name) {
    try {
        const response = await fetch(`${BASE_URL}tasks/.json`);
        const data = await response.json();
        for (const key in data) {
            if (data[key].name === name) {
                await deleteTaskByKey(key);
                alert(`Task "${name}" gelöscht (Key: ${key}).`);
                return;
            }
        }
        alert(`Task "${taskName}" nicht gefunden.`);
    } catch (error) {
        console.error("Fehler beim Abrufen oder Löschen:", error);
    }
}

async function updateSubtaskStatus(taskIndex, subtaskKey, isChecked) {
    const task = tasks[taskIndex];
    const firebaseKey = task.firebaseKey;
    if (!firebaseKey) {
        console.error("Fehlender Firebase-Key für Task:", task);
        return;
    }
    const url = `https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/tasks/${firebaseKey}/subtasks/${subtaskKey}/done.json`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(isChecked)
        });
        if (!response.ok) {
            throw new Error("Update fehlgeschlagen");
        }
        tasks[taskIndex].subtasks[subtaskKey].done = isChecked;
        renderTasksOnly();
        closeOverlay();
    } catch (error) {
        console.error("Fehler beim Speichern des Subtasks:", error);
    }
}

async function renderTasksOnly() {
    await fetchTasks();
    await fetchContacts();
    clearBoardTable();
    renderTasks(contacts);
}

function openAddTaskBoard() {
    if (window.innerWidth <= 850) {
        window.location.href = "./add_task.html";
    } else {
        assignedMembers = [];
        subtasksArray = [];
        const addTaskBoardRef = document.getElementById('addTaskBoard');
        addTaskBoardRef.innerHTML = addTaskBoardTemplate();
        document.getElementById('addTaskBoardContainer').classList.remove('hidden');
        addTaskBoardRef.classList.remove('closed_addTask');
        addTaskBoardRef.classList.add('open_addTask');
        dueDate.min = new Date().toISOString().split("T")[0];
        addCss("medium");
        getContacts();
        isAddTaskOverlayOpen = true;
    };
}

function closeAddTaskBoard() {
    isAddTaskOverlayOpen = false;
    const addTaskBoardRef = document.getElementById('addTaskBoard');
    addTaskBoardRef.classList.remove('open_addTask');
    addTaskBoardRef.classList.add('closed_addTask');
    document.getElementById('addTaskBoardContainer').classList.add('hidden');
    setTimeout(() => {
        addTaskBoardRef.innerHTML = "";
    }, 300);

}

function cancelTask() {
    const submitButton = document.getElementById("creatTask");
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

function checkButtonDisabillity() {
    const submitButton = document.getElementById("creatTask");
    const title = document.getElementById("title");
    const dueDate = document.getElementById("dueDate");
    const category = document.getElementById("category");
    checkInputs(title, dueDate, category, submitButton);
};

function addNewToDO() {
    title = document.getElementById("title").value;
    description = document.getElementById("description").value;
    dueDate = document.getElementById("dueDate").value;
    category = document.getElementById("category").value;
    pushTaskBoard(title, description, dueDate, category, priority);
    cancelTask();
    succeedRegistration();
    const Timeout = setTimeout(fowarding, 2000);
};

function pushTaskBoard(title, description, dueDate, category, priority) {
    let newTask = ({
        assigned_to: assignedMembers,
        category: category,
        date: dueDate,
        description: description,
        name: title,
        priority: priority,
        status: "toDo",
        subtasks: subtasksArray
    });
    postData(newTask);
};

function fowarding() {
    window.location.href = "./board.html";
};

function succeedRegistration() {
    let succeed = document.getElementById('succedSignup');
    succeed.classList.remove('d_none');
    document.getElementById('body').style.overflow = "hidden";
};

function toggleAddTaskLink() {
    const taskBtnBoardRef = document.getElementById('addTaskButtonBoard')
    if (window.innerWidth <= 850) {
        taskBtnBoardRef.href = "./add_task.html";
        if (isAddTaskOverlayOpen) {
            window.location.href = "./add_task.html";
        }
    } else {
        taskBtnBoardRef.href = "#";
    }
};

function toggleOverlayTask() {
    if (window.innerWidth <= 550 && isTaskOverlayOpen) {
        document.documentElement.classList.add('stopScrolling')
    } else {
        document.documentElement.classList.remove('stopScrolling')
    }
};