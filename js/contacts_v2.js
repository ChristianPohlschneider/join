function alertValidMail() {
  document.getElementById("contactEmail").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = alertValidMailText();
}

function alertValidNumber() {
  document.getElementById("contactPhone").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = alertValidNumberText();
}

function alert() {
  document.getElementById("contactName").classList.add("red-border");
  document.getElementById("contactEmail").classList.add("red-border");
  document.getElementById("contactPhone").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = warningText();
}

function alertremove() {
  document.getElementById("contactName").classList.remove("red-border");
  document.getElementById("contactEmail").classList.remove("red-border");
  document.getElementById("contactPhone").classList.remove("red-border");
  document.getElementById("warningContainer").innerHTML = "";
}

function alertEdit() {
  document.getElementById("editName").classList.add("red-border");
  document.getElementById("editMail").classList.add("red-border");
  document.getElementById("editPhone").classList.add("red-border");
  document.getElementById("warningEditContainer").innerHTML = warningText();
}

function alertValidMailEdit() {
  document.getElementById("editMail").classList.add("red-border");
  document.getElementById("warningEditContainer").innerHTML = alertValidMailText();
}

function alertValidNumberEdit() {
  document.getElementById("editPhone").classList.add("red-border");
  document.getElementById("warningEditContainer").innerHTML = alertValidNumberText();
}

function alertremoveEdit() {
  document.getElementById("editName").classList.remove("red-border");
  document.getElementById("editMail").classList.remove("red-border");
  document.getElementById("editPhone").classList.remove("red-border");
  document.getElementById("warningEditContainer").innerHTML = "";
}

function clearAddContactFields() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactPhone").value = "";
  alertremove();
}

function clearEditContactFields() {
  document.getElementById("editName").value = "";
  document.getElementById("editMail").value = "";
  document.getElementById("editPhone").value = "";
  alertremoveEdit();
}

