

function editTaskOverlay(currentTask) {
    let overlayRef = document.getElementById('cardOverlay');
    overlayRef.innerHTML = "";
    overlayRef.innerHTML = editTaskOverlayTemplate(currentTask)
    addCss(tasks[currentTask].priority);
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

document.addEventListener('click', e => {
    let assignInput = document.getElementById('assignee-container');
    let assignedRef = document.getElementById('assigned');
    if (!assignedRef.contains(e.target) && e.target !== assignInput) {
        assignedRef.classList.add('dnone');
    };
});

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