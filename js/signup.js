function updatePasswordState(inputId , iconId) {
    let passwordRef = document.getElementById(inputId);
    let passwordIcon = document.getElementById(iconId);
    if (passwordRef.value.length > 0) {
        if (passwordRef.type === "password") {
            passwordIcon.src = `../assets/icons/pw-unvisible.png`
        } else {
            passwordIcon.src = `../assets/icons/pw-visible.png`
        };
    } else {
        passwordIcon.src = `../assets/icons/pw-lock.png`
    };
};

function togglePasswordVisibility(inputId , iconId) {
    let passwordRef = document.getElementById(inputId);
    let passwordIcon = document.getElementById(iconId);
    if (passwordRef.type === "password" && passwordRef.value.length > 0) {
        passwordRef.type = "text"
        passwordIcon.src = `../assets/icons/pw-visible.png`
    } else if (passwordRef.type === "text" && passwordRef.value.length > 0) {
        passwordRef.type = "password"
        passwordIcon.src = `../assets/icons/pw-unvisible.png`
    } else {
        return
    };
};

function checkMail() {
    let mail = document.getElementById('mail')
    let warningMail = document.getElementById('warning-mail')
    let mailContainer = document.getElementById('mail-input-container')
    if (mail.value.includes('@' && '.')) {
        warningMail.classList.add('d_none')
        mailContainer.classList.remove('red-border')
    } else {
        warningMail.classList.remove('d_none')
        mailContainer.classList.add('red-border')
    }
}

function checkPassword(password, confirmPassword) {
    return new Promise((resolve, reject) => {
        if (password.value === confirmPassword.value) {
            resolve("gleiches pw")
        } else {
            reject("ungleiches pw")
        }
    })
}