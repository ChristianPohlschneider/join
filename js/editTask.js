let priority = "medium"
let assignedMembers = [];
let subtasksArray = [];

/**
 * Replaces the content of the selected subtask list item with an editable input.
 * 
 * This function targets a subtask element by its index, clears its content,
 * and inserts an input field using a predefined template to allow editing.
 * 
 * @param {number} index - The index of the subtask in the subtask array.
 */
function editTaskOverlay(currentTask) {
    let overlayRef = document.getElementById('cardOverlay');
    overlayRef.innerHTML = "";
    overlayRef.innerHTML = editTaskOverlayTemplate(currentTask);
    addCss(tasks[currentTask].priority);
    getAssignedMembers(currentTask);
    renderMembersForTask();
    getContacts();
    getSubtasksEdit(currentTask);
    dueDateEdit.min = new Date().toISOString().split("T")[0];
    initValidationEdit();
};

/**
 * Initializes form input validation for the "Create Task" button.
 * The button is enabled only if all required fields (title, due date, category) are filled.
 * Uses an interval to continuously check form input validity.
 */
function initValidationEdit() {
    const submitButton = document.getElementById("creatTaskEdit");
    const title = document.getElementById("titleEdit");
    const dueDate = document.getElementById("dueDateEdit");
    const category = document.getElementById("categoryEdit");
    if (!title || !dueDate || !category || !submitButton) {
        console.warn("Formularelemente nicht gefunden.");
        return;
    }
     if (validationInterval !== null) return;
    validationInterval = setInterval(() => {
        const isValid =
            title.value.trim() !== "" &&
            dueDate.value.trim() !== "" &&
            category.value.trim() !== "";
        submitButton.disabled = !isValid;
    }, 200)
};

/**
 * Updates the CSS styling and sets the selected priority.
 * 
 * Adds the selected priority class
 * Updates the priority image via {@link addImage}.
 * Sets the global `priority` variable to the selected value.
 * 
 * @param {string} id - the selected priority "low", "urgent" or "medium"
 */
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

/**
 * get the correct image depends on the chosen priority
 * 
 * @param {string} id - the selected priority "low", "urgent" or "medium"
 */
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

/**
 * Toggles the visibility of the contact assignment dropdown
 */
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

/**
 * Renders the list of contacts into the assignee dropdown
 * 
 * This function:
 * - Clears the current content of the assigned contact area.
 * - Extracts user names from the `contacts` array.
 * - Generates short name initials using {@link makeShortName}.
 * - For each contact, renders a dropdown entry using {@link assigneeDropdownTemplate}
 *   and sets its background color via {@link getBackgroundColor}.
 */
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

/**
 * Checks if a contact is currently assigned
 * 
 * This function compares the contact name at the given index
 * to the list of already assigned members. If a match is found, it displays
 * the contact as selected by updating the background color and checkbox icon.
 * 
 * @param {number} index - The index of the contact in the contacts array.
 * @returns {void}
 */
function checkSelectable(index) {
    const currentMember = assignedMembers.find((member) => { return member == contacts[index].name });
    let bgcolor = document.getElementById("container-" + index);
    let checked = document.getElementById("img-" + index);
    if (currentMember) {
        bgcolor.classList.add('assigned-bgcolor');
        checked.src = `../assets/icons/checkbox-checked-white.png`
    } else {
        return
    };
};

/**
 * sets the background color of the contact element with the given index.
 * 
 * @param {number} index - The index of the contact in the global `contacts` array
 */
function getBackgroundColor(index) {
    document.getElementById(index).style.backgroundColor = contacts[index].color;
};

/**
 * creates initials from name array
 * 
 * loop trough userNames array and creates the initials from each name
 * 
 * @param {Array} userNames - array of contact names from the contacts array
 * @returns {string} - first letter from the name and first letter from the surname
 */
function makeShortName(userNames) {
    return userNames.map(name => {
        const parts = name.trim().split(" ");
        const first = parts[0]?.charAt(0).toUpperCase() || "";
        const last = parts[1]?.charAt(0).toUpperCase() || "";
        return first + last;
    });
};

/**
 * Renders the currently assigned members for a task.
 * 
 * Creates initials out of the assigned members.
 * Displays them and get them the same background color.
 */
function renderMembersForTask() {
    const contentPlace = document.getElementById("memberForTask");
    contentPlace.innerHTML = "";
    const initialsMembers = makeShortName(assignedMembers);
    for (let index = 0; index < assignedMembers.length; index++) {
        if (index == 5) {
            contentPlace.innerHTML += moreMemberTemplate()
            return
        }
        contentPlace.innerHTML += meberTemplate(initialsMembers, index);
        findSameBgColor(initialsMembers, assignedMembers, index);
    };
};

/**
 * Retrieves the assigned members of a specific task and stores them in the global `assignedMembers` array.
 * 
 * @param {number|string} currentTask - The key or index identifying the current task in the `tasks` array or object.
 * @returns {Array<string>} - An array containing the names of the assigned members.
 */
function getAssignedMembers(currentTask) {
    assignedMembers = [];
    if (tasks[currentTask].assigned_to) {
        for (const [key, value] of Object.entries(tasks[currentTask].assigned_to)) {
            let nameValue = value;
            assignedMembers.push(`${nameValue}`);
        };
        return assignedMembers;
    } else {
        return
    }
};

/**
 * Finds the contact by full name and sets their background color on the matching DOM element.
 * 
 * @param {string} fullname - current name
 * @param {number} index - Index of the contact to apply the color for.
 */
function findSameBgColor(initals, fullname, index) {
    const findSameInitials = contacts.find(({ name }) => { return name == fullname[index] });
    document.getElementById('picked-' + index).style.backgroundColor = findSameInitials.color;
};

/**
 * Toggles a user's assignment status for a task.
 * 
 * Adds or removes the given user from the `assignedMembers` array depending on their current state.
 * Updates the UI by changing the background color and checkbox icon accordingly
 * Finally, re-renders the member list for the task.
 * 
 * @param {number} index -The index of the member in the contact list
 * @param {string} userName - The name of the user to add or remove from the task.
 */
function addMember(index, shortName, userName) {
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

/**
 * Checks the input value of the subtask field.
 * 
 * If the subtask input is empty, it shows a plus icon
 * Otherwise, it shows a delete and add icon
 */
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

/**
 * Add new subtask to the subtask list.
 * 
 * adds the input value to an subtask array if its not empty
 * clears the input field
 * calls {@link renderSubtasks} to update the HTML
 * calls {@link checkSubtask} to validate the current subtask list.
 */
function addSubtask() {
    subtask = document.getElementById("subtask");
        subtask.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("subtask-add-btn").click();
    }
  });
    if (subtask.value.trim()) {
        subtasksArray.push({
            done: false,
            title: subtask.value
        });
        renderSubtasksEdit();
        subtask.value = "";
    }
    checkSubtask();
};

/**
 * Loop trough the subtask array and appends the HTML for each subtask
 */
function renderSubtasksEdit() {
    subtaskList.innerHTML = "";
    for (let index = 0; index < subtasksArray.length; index++) {
        subtaskList.innerHTML += subtaskEditTemplate(index, subtasksArray);
    };
};

/**
 * Removes the input value of the subtask field
 * 
 */
function deleteSubtaskInput() {
    let subtaskRef = document.getElementById('subtask');
    subtaskRef.value = "";
    checkSubtask();
};

/**
 * Opens the subtask edit input for the specified subtask by index.
 * 
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function openSubtaskEdit(index) {
    let subtaskEdit = document.getElementById(subtasksArray[index].title + "-" + index);
    subtaskEdit.classList.remove('d_none');
};

/**
 * Closes the subtask edit input for the specified subtask by index.
 * 
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function closeSubtaskEdit(index) {
    let subtaskEdit = document.getElementById(subtasksArray[index].title + "-" + index);
    subtaskEdit.classList.add('d_none');
};

/**
 * Removes the subtask edit input for the specified subtask by index.
 * And renders the subtask's via {@link renderSubtasks}.
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function removeSubtask(index) {
    subtasksArray.splice(index, 1);
    renderSubtasksEdit();
};

/**
 * Replaces a subtask's list item with an editable input template.
 * 
 * This function clears the current content of the subtask element and replaces it
 * with an input field to allow editing.
 * 
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function editSubtask(index) {
    let currentListItem = document.getElementById("subtask-" + index);
    currentListItem.innerHTML = "";
    currentListItem.innerHTML = editSubtaskOverlayTemplate(index);
};

/**
 * Add the edit subtask value to the subtask array
 * And renders the subtask's via {@link renderSubtasks}.
 * @param {number} index - The index of the subtask to edit in the subtask array.
 */
function addEditSubtask(index) {
    let editInput = document.getElementById('edit-input');
    subtasksArray[index].title = editInput.value;
    renderSubtasksEdit();
};

/**
 * Loads the subtasks of a specific task into the global `subtasksArray` and triggers rendering.
 * 
 * Retrieves the `subtasks` object from the task at `taskIndex`, converts it into an array,
 * and stores it in `subtasksArray`. Then calls `renderSubtasksEdit` to display them.
 * 
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {void}
 */
function getSubtasksEdit(taskIndex) {
    subtasksArray = [];
    const task = tasks[taskIndex];
    const subtasksObj = task.subtasks;
    if (!subtasksObj || typeof subtasksObj !== "object") {
        return;
    };
    subtasksArray = Object.values(subtasksObj);
    renderSubtasksEdit();
};

/**
 * Edits an existing task with updated input values and refreshes the task board.
 * 
 * Retrieves updated task details from the input fields, then calls `pushTask` 
 * to update the task at the given `taskIndex`. Afterwards, it closes the overlay 
 * and reinitializes the task board.
 * 
 * @param {number} taskIndex - The index of the task to be edited.
 * @returns {Promise<void>} - Resolves when the task is updated and the board is refreshed.
 */
async function editToDo(taskIndex) {
    title = document.getElementById("titleEdit").value;
    description = document.getElementById("description").value;
    dueDate = document.getElementById("dueDateEdit").value;
    category = document.getElementById("categoryEdit").value;
    await pushTask(title, description, dueDate, category, priority, taskIndex);
    closeOverlay();
    await initboard();
};

/**
 * Creates a new task object and sends it to the backend.
 * 
 * @param {string} title - task title
 * @param {string} description - task description
 * @param {string} dueDate - due date 
 * @param {string} category - the selected task category
 * @param {string} priority - the selected priority
 */
async function pushTask(title, description, dueDate, category, priority, taskIndex) {
    let editTask = ({
        assigned_to: assignedMembers,
        category: category,
        date: dueDate,
        description: description,
        name: title,
        priority: priority,
        status: tasks[taskIndex].status,
        subtasks: subtasksArray
    });
    currentTaskPath = BASE_URL + "tasks/" + Object.keys(taskResponse)[taskIndex];
    await putData(currentTaskPath, editTask)
};

/**
 * Enables or disables the submit button based on input field values.
 * 
 * Checks whether the `title`, `dueDate`, and `category` fields are non-empty.
 * If any of the fields are empty , disables the `submitButton`.
 * Otherwise, enables the button.
 * 
 * @param {HTMLInputElement} title - Input field for the task title.
 * @param {HTMLInputElement} dueDate - Input field for the due date.
 * @param {HTMLInputElement} category - Input field for the category.
 * @param {HTMLButtonElement} submitButton - The button to enable/disable.
 */
function checkInputs(title, dueDate, category, submitButton) {
    if (title.value.trim() === "" || dueDate.value.trim() === "" || category.value.trim() === "") {
        submitButton.disabled = true;
    } else { submitButton.disabled = false; }
}

/**
 * Initializes the search input for filtering contacts.
 */
function searchContact() {
    const searchInput = document.getElementById('assignee-input');
    searchInput.addEventListener('input', filterAssigned);
};

/**
 * Filters the list of assigned contacts based on user input.
 * 
 * @param {Event} event - The input event triggered by typing in the search field. 
 */
function filterAssigned(event) {
    const searchTerm = event.target.value.toLowerCase();
    const assigned = document.querySelectorAll('.selectable-assigned-contact');
    assigned.forEach(contact => {
        const content = contact.innerText.toLowerCase();
        contact.style.display = content.includes(searchTerm) ? 'flex' : 'none';
    });
};
