function menu() {
    return `    
    <div class="menu-style">
        <div class="menu-tasks">
            <div class="menu-div">
                <img class="logo-join" src="../assets/icons/join-logo.png" alt="join logo">
            </div>

            <div class="gap-menu">
            <a class="a-menu menu-button-possition" href="./summary.html" class="menu-button-possition">
                <div class="icon-menu-summary"></div>
                <p class="padding-left-10px p-menu-style">Summary</p>
            </a>
            <a class="a-menu menu-button-possition" href="./add_task.html" class="menu-button-possition">
                <img src="../assets/icons/add-task.png" alt="add task logo">
                <p class="padding-left-10px p-menu-style">Add Task</p>
            </a>
            <a class="a-menu menu-button-possition" href="./board.html" class="menu-button-possition">
                <img src="../assets/icons/board.png" alt="board logo">
                <p class="padding-left-10px p-menu-style">Board</p>
            </a>
            <a class="a-menu menu-button-possition" href="./contact.html" class="menu-button-possition">
                <img src="../assets/icons/contact.png" alt="contact logo">
                <p class="padding-left-10px p-menu-style">Contact</p>
            </a>
           </div>
        </div>
        <div class="position-bottom">
            <a href="../html/privacy_policy.html" class="flex-center padding-10px">Privacy Policy</a>
            <a href="../html/legal_notice.html" class="flex-center padding-10px">Legal notice</a>
        </div>
    </div>
    `;
}