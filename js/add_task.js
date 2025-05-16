function initTask () {
    document.getElementById("menuTemplate").innerHTML = menu();
}

const avatar = document.getElementById("userAvatar");
const slider = document.getElementById("userSlider");

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


