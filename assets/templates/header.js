function header() {
  return `  
    <div class="header-title">Kanban Project Management Tool</div>
    <img class="logo" src="../assets/icons/Join-main-logo.png" alt="Join Logo">
    
    <div id="header-help" class="header-help">
        <a href="../html/help.html">
            <img src="../assets/icons/help.png" alt="Help Icon" class="help-icon">
        </a>
        <div id="userAvatar" class="avatar"></div>
        <div id="userSlider" class="slider">
            <ul>
                <li><a href="./legal_notice.html">Legal Notice</a></li>
                <li><a href="./privacy_policy.html">Privacy Policy</a></li>
                <li><a onclick="clearStorage()" href="/index.html">Log out</a></li>
            </ul>
        </div>
    </div>
  `;
}

function clearStorage() {
  localStorage.clear();
}

function initTask () {
  document.getElementById("menuTemplate").innerHTML = checkLogged();
  document.getElementById("headerTemplate").innerHTML = header();
  initAvatarSlider();
}

function initAvatarSlider() {
  const avatar = document.getElementById("userAvatar");
  const slider = document.getElementById("userSlider");

  let userName = localStorage.getItem("user");
  userName = userName?.replace(/['"]/g, "");
  if (userName) {
    const initials = getInitials(userName);
    avatar.textContent = initials;
  } else {
    document.getElementById('header-help').classList.add('d_none')
  }

  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    slider.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    const isClickInside = slider.contains(e.target) || avatar.contains(e.target);
    if (!isClickInside) {
      slider.classList.remove("open");
    }
  });
}

function getInitials(name) {
  return name
    .trim()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
}