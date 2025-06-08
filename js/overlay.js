let subtaskCounter = 0;

function loadTaskOverlayData(taskIndex) {
    findBackgroundColor(taskIndex);
    getOverlaySubtasks(taskIndex);
    getAssignedTo(taskIndex, contacts);
    getAssignedToNames(taskIndex, contacts);
    getPriority(taskIndex);
    document.getElementById("priority#" + taskIndex).innerHTML += tasks[taskIndex].priority.charAt(0).toUpperCase() + tasks[taskIndex].priority.slice(1);
}

function openTaskOverlay(taskIndex, event) {
    document.getElementById("currentContent").innerHTML = "";
    document.getElementById("boardTaskOverlay").classList.remove("hidden");
    document.getElementById("currentContent").innerHTML += renderTaskOverlay(taskIndex, subtaskCounter);
    loadTaskOverlayData(taskIndex);
    event.stopPropagation();
    document.body.classList.add("stopScrolling");
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
    document.getElementById("currentContent").innerHTML = "";
    document.getElementById("boardTaskOverlay").classList.add("hidden");
    
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
        // alert(`Subtask ${subtaskKey} gespeichert: ${isChecked}`);
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