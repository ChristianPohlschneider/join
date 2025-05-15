function initSummary() {
    summaryWelcome();
    initTask();
}

const time = new Date();

function initTask() {
    document.getElementById("menuTemplate").innerHTML = menu();
}

function summaryWelcome() {
    contentRef = document.getElementById("content");

    greetingTime = switchTime();

    greeting.innerHTML = greetingTime + `<p class="user-name">Noah Kallan<p>`;
}

function switchTime() {
    t = time.getHours();

    switch (true) {
        case (t < 12):
            return "Good morning";
        case (t >= 12 && t <= 18):
            return "Good afternoon";
        default:
            return "Good evening";
    }
}

