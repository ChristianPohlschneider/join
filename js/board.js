function initboard () {
    document.getElementById("menuTemplate").innerHTML = menu();
    document.querySelector("header").innerHTML = header();
    initAvatarSlider();
}