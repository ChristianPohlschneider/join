let currentUser;

async function init() {
    const timeout = setTimeout(closeLoader, 2500);
    await fetchUsers();
};

function logIn() {
    let emailRef = document.getElementById('mail');
    let passwordRef = document.getElementById('password');
    currentUser = users.find((user) => user.email == emailRef.value && user.password == passwordRef.value);
    if (currentUser) {
        window.location.href = "./html/summary.html";
        safeToLocalStorage();
    } else {
        wrongMailandPassword(emailRef, passwordRef);
    };
    emailRef.value = "";
    passwordRef.value = "";
};

function guestLogIn() {
    let emailRef = document.getElementById('mail');
    let passwordRef = document.getElementById('password');
    emailRef.value = "guest@login.com"
    passwordRef.value = "aH%1234567"
    logIn();
};

function safeToLocalStorage() {
    localStorage.setItem("user", JSON.stringify(currentUser.name));
};

function wrongMailandPassword(emailRef, passwordRef) {
    let warningRef = document.getElementById('warning');
    let inputMail = document.getElementById('mail-container');
    let inputPassword = document.getElementById('password-container');
    warningRef.classList.remove('d_none');
    emailRef.value = "";
    passwordRef.value = "";
    inputMail.classList.add('red-border');
    inputPassword.classList.add('red-border');
};

function removeRedBorder() {
    let warningRef = document.getElementById('warning');
    let inputMail = document.getElementById('mail-container');
    let inputPassword = document.getElementById('password-container');
    warningRef.classList.add('d_none');
    inputMail.classList.remove('red-border');
    inputPassword.classList.remove('red-border');
};

function closeLoader() {
    document.getElementById('animation').classList.add('d_none');
};

function updatePasswordState() {
    let passwordRef = document.getElementById('password');
    let passwordIcon = document.getElementById('password-icon');
    if (passwordRef.value.length > 0) {
        if (passwordRef.type === "password") {
            passwordIcon.src = `./assets/icons/pw-unvisible.png`
        } else {
            passwordIcon.src = `./assets/icons/pw-visible.png`
        };
    } else {
        passwordIcon.src = `./assets/icons/pw-lock.png`
    };
};

function togglePasswordVisibility() {
    let passwordRef = document.getElementById('password');
    let passwordIcon = document.getElementById('password-icon');
    if (passwordRef.type === "password" && passwordRef.value.length > 0) {
        passwordRef.type = "text"
        passwordIcon.src = `./assets/icons/pw-visible.png`
    } else if (passwordRef.type === "text" && passwordRef.value.length > 0) {
        passwordRef.type = "password"
        passwordIcon.src = `./assets/icons/pw-unvisible.png`
    } else {
        return
    };
};
