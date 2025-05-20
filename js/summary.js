async function initSummary() {
    await fetchTasks();
    summaryWelcome();
    initTask();
    renderSummary();
}

const time = new Date();

function initTask() {
    document.getElementById("menuTemplate").innerHTML = checkLogged();
    document.getElementById("headerTemplate").innerHTML = header();
}

function summaryWelcome() {
    contentRef = document.getElementById("content");

    greetingTime = switchTime();

    greeting.innerHTML = greetingTime + getUserInfo();
}

function switchTime() {
    t = time.getHours();

    switch (true) {
        case (t >= 6 && t < 12):
            return "Good morning";
        case (t >= 12 && t <= 18):
            return "Good afternoon";
        default:
            return "Good evening";
    }
}

function getUserInfo() {
    let user = JSON.parse(localStorage.getItem("user"));

    switch (true) {
        case (user === "Guest"):
            return "";
        default:
            return `,` + `<p class="user-name">${user}</p>`;
    }
}

function renderSummary() {
    renderFirstRow();
    renderSecondRow();
    renderThirdRow();
}

function renderSecondRow() {
    let allUrgents = document.getElementById('urgent');
    let currentUrgent = tasks.filter((i) => i.priority === "urgent");
    allUrgents.innerHTML = `${currentUrgent.length}`;
    let urgentDates = [];
    for (let index = 0; index < currentUrgent.length; index++) {
        urgentDates.push(new Date(currentUrgent[index].date))
    }
    const minDate = new Date(Math.min(...urgentDates));
    let urgentDate = document.getElementById('urgant-date');
    urgentDate.innerHTML = minDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function renderFirstRow() {
    let allToDoes = document.getElementById('to-do');
    let currentToDoes = tasks.filter((i) => i.status === "toDo");
    allToDoes.innerHTML = `${currentToDoes.length}`;
    let allDones = document.getElementById('done');
    let currentDones = tasks.filter((i) => i.status === "done");
    allDones.innerHTML = `${currentDones.length}`;
}

function renderThirdRow() {
    let allTasks = document.getElementById('tasks-in-board');
    allTasks.innerHTML = `${tasks.length}`;
    let allInProgress = document.getElementById('tasks-in-progress');
    let currentInProgress = tasks.filter((i) => i.status === "inProgress");
    allInProgress.innerHTML = `${currentInProgress.length}`;
    let allAwait = document.getElementById('awaiting-feedback');
    let currentAwait = tasks.filter((i) => i.status === "await");
    allAwait.innerHTML = `${currentAwait.length}`;
}
