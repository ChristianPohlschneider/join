const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitPattern = /^\+?\d[\d\s\-()]+$/

/**
 * Closes a given overlay by its ID.
 * @param {string} overlayId - The overlay element ID.
 */
function closeOverlayByElement(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) overlay.classList.add("hidden");
}

// Global click handler for closing overlays
document.addEventListener("click", function (event) {
  const openOverlays = document.querySelectorAll(".overlay:not(.hidden)");

  openOverlays.forEach(overlay => {
    if (event.target === overlay) {
      overlay.classList.add("hidden");
    }
  });
});

// Toggle sidebar menu visibility using 'dnone' class
const contactsSlider = document.getElementById("contactsSlider");
const sliderTrigger = document.getElementById("sliderTrigger");

if (contactsSlider && sliderTrigger) {
  sliderTrigger.addEventListener("click", function (event) {
    event.stopPropagation();
    contactsSlider.classList.toggle("dnone");
  });

  document.addEventListener("click", function (event) {
    // Nur schließen, wenn geöffnet ist
    const isClickOutside =
      !contactsSlider.contains(event.target) &&
      !sliderTrigger.contains(event.target);

    if (isClickOutside && !contactsSlider.classList.contains("dnone")) {
      contactsSlider.classList.add("dnone");
    }
  });
}

/**
 * Shows feedback that contact was added successfully.
 */
function contactAddedSuccessfully() {
  const feedbackEl = document.getElementById("userFeedback");
  feedbackEl.classList.remove("hidden");

  setTimeout(() => {
    feedbackEl.classList.add("hidden");
  }, 4000);
}

/**
 * Clears the add-contact form fields.
 */
function clearAddContactFields() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactPhone").value = "";
}

/**
 * Deletes the currently selected contact.
 */
function deleteCurrentContact() {
  if (currentEditKey) {
    deleteContact(currentEditKey);
    closeEditContact();
  }
}

/**
 * Highlights the email input field in red and displays
 * a warning message when the email address is invalid.
 */
function alertValidMail() {
  document.getElementById("contactEmail").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = alertValidMailText();
}

/**
 * Highlights the phone number input field in red and displays
 * a warning message when the phone number is invalid.
 */
function alertValidNumber() {
  document.getElementById("contactPhone").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = alertValidNumberText();
}

/**
 * Adds a red border to the contact form fields
 * and displays a warning message in the container.
 */
function alert() {
  document.getElementById("contactName").classList.add("red-border");
  document.getElementById("contactEmail").classList.add("red-border");
  document.getElementById("contactPhone").classList.add("red-border");
  document.getElementById("warningContainer").innerHTML = warningText();
}

/**
 * Removes the red border from the contact form fields
 * and clears the warning message container.
 */
function alertremove() {
  document.getElementById("contactName").classList.remove("red-border");
  document.getElementById("contactEmail").classList.remove("red-border");
  document.getElementById("contactPhone").classList.remove("red-border");
  document.getElementById("warningContainer").innerHTML = "";
}

/**
 * Adds a red border to the contact form fields
 * and displays a warning message in the container.
 */
function alertEdit() {
  document.getElementById("editName").classList.add("red-border");
  document.getElementById("editMail").classList.add("red-border");
  document.getElementById("editPhone").classList.add("red-border");
  document.getElementById("editWarningContainer").innerHTML = warningText();
}

/**
 * Removes the red border from the contact form fields
 * and clears the warning message container.
 */
function alertremoveEdit() {
   document.getElementById("editName").classList.remove("red-border");
  document.getElementById("editMail").classList.remove("red-border");
  document.getElementById("editPhone").classList.remove("red-border");
  document.getElementById("editWarningContainer").innerHTML = "";
}

/**
 * Highlights the email input field in red and displays
 * a warning message when the email address is invalid.
 */
function alertValidMailEdit() {
  document.getElementById("editMail").classList.add("red-border");
  document.getElementById("editWarningContainer").innerHTML = alertValidMailText();
}

/**
 * Highlights the phone number input field in red and displays
 * a warning message when the phone number is invalid.
 */
function alertValidNumberEdit() {
  document.getElementById("editPhone").classList.add("red-border");
  document.getElementById("editWarningContainer").innerHTML = alertValidNumberText();
}
