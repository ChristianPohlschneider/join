const BASE_URL = "https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/"
let currentUser;
let users = []

async function init() {
    const timeout = setTimeout(closeLoader, 2500);
    await fetchUsers()
};

async function fetchUsers() {
    let userResponse = await getAllUsers("users");
    let userKeysArray = Object.values(userResponse);
    for (let index = 0; index < userKeysArray.length; index++) {
        users.push(
            {
                "email" :  userKeysArray[index].email,
                "password" : userKeysArray[index].password,
                "name" : userKeysArray[index].name
            }
        );
    };
}

async function getAllUsers(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}

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
