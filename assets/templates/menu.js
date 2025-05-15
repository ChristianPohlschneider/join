function menu() {
    return `    
    <div class="menu-style">
        <div class="menu-tasks">
            <div class="menu-div">
                <img class="logo-join" src="../assets/icons/join-logo.png" alt="join logo">
            </div>
            <a href="#summary" class="menu-button-possition margin-bottom-15px">
                <img src="../assets/icons/summary.png" alt="summary logo">
                <p class="padding-left-10px">Summary</p>
            </a>
            <a href="#add-task" class="menu-button-possition margin-bottom-15px">
                <img src="../assets/icons/add-task.png" alt="add task logo">
                <p class="padding-left-10px">Add Task</p>
            </a>
            <a href="#board" class="menu-button-possition margin-bottom-15px">
                <img src="../assets/icons/board.png" alt="board logo">
                <p class="padding-left-10px">Board</p>
            </a>
            <a href="#contact" class="menu-button-possition margin-bottom-15px">
                <img src="../assets/icons/contact.png" alt="contact logo">
                <p class="padding-left-10px">Contact</p>
            </a>

        </div>
        <div class="possition-absolute-bottom">
            <a href="#privacy-policy" class="flex-center padding-10px">Privacy Policy</a>
            <a href="#legal-notice" class="flex-center padding-10px">Legal notice</a>
        </div>
    </div>
    `;
}