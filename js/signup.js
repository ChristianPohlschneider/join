let checkbox = false;
const BASE_URL = "https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/"

async function signup() {
    try {
        clearErrors();
        let userName = checkName();
        let userMail = checkMail();
        let userPassword = checkPassword();
        await createUser(userName, userMail, userPassword);
        succeedRegistration();
        const Timeout = setTimeout(fowarding, 2000);
    } catch (error) {
        error.code === 'password mismatch' ? passwordError(error) : error.code === 'noName' ? nameError(error) : emailError(error);
    }
};

function succeedRegistration() {
    let succeed = document.getElementById('succedSignup');
    succeed.classList.remove('d_none');
    document.getElementById('body').style.overflow = "hidden";
};

function fowarding() {
    window.location.href = "../index.html";
};

async function createUser(name, email, password) {
    let response = await fetch(BASE_URL + "/users" + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                email: email,
                name: name,
                password: password
            }
        )
    });
};

function clearErrors() {
    let nameContainer = document.getElementById('name-input-container');
    let nameInput = document.getElementById('warning-name');
    nameInput.classList.add('d_none');
    nameContainer.classList.remove('red-border');
    let matchPassword = document.getElementById('warning-password');
    let passwordContainer = document.getElementById('pasword-confirm-input-container');
    let passwordCOnfirmContainer = document.getElementById('pasword-input-container');
    matchPassword.classList.add('d_none');
    passwordContainer.classList.remove('red-border');
    passwordCOnfirmContainer.classList.remove('red-border');
    let warningMail = document.getElementById('warning-mail');
    let mailContainer = document.getElementById('mail-input-container');
    warningMail.classList.add('d_none');
    mailContainer.classList.remove('red-border');
};

function checkName() {
    let name = document.getElementById('name');
    let nameContainer = document.getElementById('name-input-container');
    let nameInput = document.getElementById('warning-name');
    if (name.value.trim().length === 0) {
        throw {
            code: 'noName',
            nameText: nameInput,
            nameBorder: nameContainer,
        };
    } else {
        return name.value
    };
};

function checkPassword() {
    let password = document.getElementById('password');
    let confirmPwassword = document.getElementById('confirm-password');
    let matchPassword = document.getElementById('warning-password');
    let passwordContainer = document.getElementById('pasword-confirm-input-container');
    let passwordCOnfirmContainer = document.getElementById('pasword-input-container');
    if (password.value === confirmPwassword.value && password.value.length != 0) {
        return password.value
    } else {
        throw {
            code: 'password mismatch',
            passwordText: matchPassword,
            passwordBorder: passwordContainer,
            passwordConfirmBorder: passwordCOnfirmContainer
        };
    };
};

function checkMail() {
    let email = document.getElementById('mail');
    let warningMail = document.getElementById('warning-mail');
    let mailContainer = document.getElementById('mail-input-container');
    if (!email.value.includes('@') || !email.value.includes('.') || email.value.trim().length === 0) {
        throw {
            code: 'email incorrect',
            mailText: warningMail,
            mailBorder: mailContainer
        };
    } else {
        return email.value;
    };
};

function updatePasswordState(inputId, iconId) {
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

function togglePasswordVisibility(inputId, iconId) {
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

function passwordError(error) {
    error.passwordText.classList.remove('d_none');
    error.passwordBorder.classList.add('red-border');
    error.passwordConfirmBorder.classList.add('red-border');
};

function nameError(error) {
    error.nameText.classList.remove('d_none');
    error.nameBorder.classList.add('red-border');
};

function emailError(error) {
    error.mailText.classList.remove('d_none');
    error.mailBorder.classList.add('red-border');
};

function toggleCheckbox() {
    let checkboxRef = document.getElementById('checkbox');
    let signupBtn = document.getElementById('signup-Btn');
    if (checkbox == false) {
        checkboxRef.src = `../assets/icons/checkbox-checked.png`
        signupBtn.disabled = false;
    } else {
        checkboxRef.src = `../assets/icons/checkbox.png`;
        signupBtn.disabled = true;
    }
    checkbox = !checkbox;
};