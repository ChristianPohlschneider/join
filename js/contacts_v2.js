/**
 * Highlights the email input with a red border and displays a warning for invalid email.
 */
function alertValidMail() {
  document.getElementById("contactEmail").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = alertValidMailText();
}

/**
 * Highlights the phone input with a red border and displays a warning for invalid phone number.
 */
function alertValidNumber() {
  document.getElementById("contactPhone").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = alertValidNumberText();
}

/**
 * Highlights all required contact fields with a red border and shows a general warning message.
 */
function alert() {
  document.getElementById("contactName").classList.add("red-border");
  document.getElementById("contactEmail").classList.add("red-border");
  document.getElementById("contactPhone").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = warningText();
}

/**
 * Removes all red borders from contact input fields and clears the warning container.
 */
function alertremove() {
  document.getElementById("contactName").classList.remove("red-border");
  document.getElementById("contactEmail").classList.remove("red-border");
  document.getElementById("contactPhone").classList.remove("red-border");
  document.getElementById("warningContainer").innerHTML = "";
}

/**
 * Highlights all required edit contact fields with a red border and shows a general warning.
 */
function alertEdit() {
  document.getElementById("editName").classList.add("red-border");
  document.getElementById("editMail").classList.add("red-border");
  document.getElementById("editPhone").classList.add("red-border");
  document.getElementById("warningEditContainer").innerHTML = warningText();
}

/**
 * Highlights the email input in the edit form with a red border and shows a warning for invalid email.
 */
function alertValidMailEdit() {
  document.getElementById("editMail").classList.add("red-border");
  document.getElementById("warningEditContainer").innerHTML = alertValidMailText();
}

/**
 * Highlights the phone input in the edit form with a red border and shows a warning for invalid phone number.
 */
function alertValidNumberEdit() {
  document.getElementById("editPhone").classList.add("red-border");
  document.getElementById("warningEditContainer").innerHTML = alertValidNumberText();
}

/**
 * Removes all red borders from edit contact input fields and clears the warning container.
 */
function alertremoveEdit() {
  document.getElementById("editName").classList.remove("red-border");
  document.getElementById("editMail").classList.remove("red-border");
  document.getElementById("editPhone").classList.remove("red-border");
  document.getElementById("warningEditContainer").innerHTML = "";
}

/**
 * Clears all input fields in the add contact form and removes validation warnings.
 */
function clearAddContactFields() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactPhone").value = "";
  alertremove();
}

/**
 * Clears all input fields in the edit contact form and removes validation warnings.
 */
function clearEditContactFields() {
  document.getElementById("editName").value = "";
  document.getElementById("editMail").value = "";
  document.getElementById("editPhone").value = "";
  alertremoveEdit();
}

