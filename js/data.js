const BASE_URL = "https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];
let tasks = [];
let contacts = [];
let taskResponse;

async function fetchInit() {
    await fetchTasks();
    await fetchUsers();
}

async function fetchTasks() {
    taskResponse = await getAllTasks("tasks");
    tasks = Object.values(taskResponse);
};

async function getAllTasks(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
};

async function fetchUsers() {
    let userResponse = await getAllUsers("users");
    users = Object.values(userResponse);
};

async function getAllUsers(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
};


async function putData(currentTaskPath, data={}) {     
     let response = await fetch(currentTaskPath + ".json",{
        method : "PUT", 
        header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data)                            
    });
    return response = await response.json()
}