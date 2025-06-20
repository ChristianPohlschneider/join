/** @type {string|null} Currently selected contact key for editing */
let currentEditKey = null;

/**
 * Initializes the contacts module.
 * - Loads contacts
 * - Initializes tasks
 * - Highlights the contacts link
 */
async function initContacts() {
  await fetchContacts();
  initTask();
  highlightLink();
}

/**
 * Fetches all contacts and renders them.
 * If no data is found, shows a placeholder template.
 */
async function fetchContacts() {
  try {
    const data = await getAllUsers("contacts");

    if (!data) {
      document.getElementById("contactList").innerHTML = noKontaktTamplate();
      return;
    }

    renderContacts(data);
  } catch (error) {}
}

/**
 * Fetches data from a given path on the server.
 * @param {string} path - The data path (e.g., 'contacts').
 * @returns {Promise<Object>} The fetched JSON data.
 */
async function getAllUsers(path) {
  const response = await fetch(BASE_URL + path + ".json");
  return await response.json();
}

/**
 * Highlights the currently active link in the navigation.
 */
function highlightLink() {
  const currentLink = document.getElementById('contacts');
  currentLink.classList.add('activeLink');
}

/**
 * Renders the contact list grouped by first letter of name.
 * @param {Object} contactsData - The contacts data object.
 */
function renderContacts(contactsData) {
  const list = document.getElementById("contactList");
  list.innerHTML = "";
  const contacts = Object.entries(contactsData);
  contacts.sort((a, b) => a[1].name.localeCompare(b[1].name));
  let currentGroup = "";
  contacts.forEach(([key, contact]) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (firstLetter !== currentGroup) {
      currentGroup = firstLetter;
      appendGroupHeader(list, currentGroup);
    }
    appendContactElement(list, key, contact);
  });
}

/**
 * Appends a single contact element to the contact list.
 * @param {HTMLElement} list - The contact list element.
 * @param {string} key - The contact's key.
 * @param {Object} contact - The contact data.
 */
function appendContactElement(list, key, contact) {
  const color = contact.color || getRandomColor();
  const div = document.createElement("div");
  div.classList.add("contact-div");
  div.id = key;
  div.setAttribute("onclick", `showCurrentContact('${key}')`);

  div.innerHTML = listTamplate(color, contact);

  div.addEventListener("click", () => showContact(contact, color, key));
  list.appendChild(div);
}

/**
 * Appends a group header to the contact list.
 * @param {HTMLElement} list - The contact list element.
 * @param {string} groupLetter - The initial letter for grouping.
 */
function appendGroupHeader(list, groupLetter) {
  const groupHeader = document.createElement("div");
  groupHeader.classList.add("contact-group-header");
  groupHeader.textContent = groupLetter;
  list.appendChild(groupHeader);

  const highlightDiv = document.createElement("div");
  highlightDiv.classList.add("contact-group-highlight");
  list.appendChild(highlightDiv);
}

/**
 * Highlights the currently selected contact.
 * @param {string} id - The ID of the contact to highlight.
 */
function showCurrentContact(id) {
  const prev = document.querySelector(".CurrentContact");
  if (prev) {
    prev.classList.remove("CurrentContact");
  }

  const current = document.getElementById(id);
  if (current) {
    current.classList.add("CurrentContact");
  }
}

/**
 * Extracts and returns initials from a full name.
 * @param {string} name - Full name of the contact.
 * @returns {string} The initials (e.g., "JD").
 */
function getInitials(name) {
  return name.split(" ").map(n => n[0].toUpperCase()).join("");
}

/**
 * Returns a random color from a predefined set.
 * @returns {string} A HEX color string.
 */
function getRandomColor() {
  const colors = ["#6E52FF", "#FFA35E", "#FFE62B", "#00BEE8", "#FF5EB3", "#FFBB2B", "#FF745E", "#C3FF2B", "#FF7A00", "#1FD7C1", "#0038FF", "#FFC701", "#9327FF", "#FC71FF", "#FF4646"];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Shows the contact list and hides contact detail view.
 */
function backToList() {
  document.getElementById("contactDetails").classList.remove("show");
  document.querySelector(".contacts-list").classList.add("show");
}

/**
 * Opens the "Add Contact" overlay.
 */
function openAddContact() {
  document.getElementById("addContactOverlay").classList.remove("hidden");
}

/**
 * Closes the "Add Contact" overlay and clears form fields.
 */
function closeAddContact() {
  document.getElementById("addContactOverlay").classList.add("hidden");
  clearAddContactFields();
}

/**
 * Opens the "Edit Contact" overlay.
 */
function openEditContact() {
  document.getElementById("editContactOverlay").classList.remove("hidden");
}

/**
 * Closes the "Edit Contact" overlay and resets the state.
 */
function closeEditContact() {
  document.getElementById("editContactOverlay").classList.add("hidden");
  currentEditKey = null;
}

/**
 * Starts editing a specific contact by its key.
 * @param {string} key - The contact's key.
 */
async function editContact(key) {
  try {
    const contact = await fetchContactByKey(key);
    if (!contact) {
      alert("Contact not found.");
      closeEditContact();
      return;
    }

    const { name, mail, phone_number: phone } = contact;
    const color = await ensureContactColor(key, contact.color);

    fillEditForm(name || "", mail || "", phone || "", color);
    currentEditKey = key;
    showEditOverlay(name || "", color);
  } catch (error) {}
  toggleContactsSlider();
}

/**
 * Fetches a contact by its key.
 * @param {string} key - The contact's key.
 * @returns {Promise<Object>} The contact object.
 */
async function fetchContactByKey(key) {
  const response = await fetch(`${BASE_URL}contacts/${key}.json`);
  return await response.json();
}

/**
 * Ensures that the contact has a color; assigns one if missing.
 * @param {string} key - The contact's key.
 * @param {string} color - Existing color (if any).
 * @returns {Promise<string>} The contact's color.
 */
async function ensureContactColor(key, color) {
  if (!color) {
    color = getRandomColor();
    await fetch(`${BASE_URL}contacts/${key}/color.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(color)
    });
  }
  return color;
}

/**
 * Fills the contact edit form with data.
 * @param {string} name
 * @param {string} mail
 * @param {string} phone
 * @param {string} color
 */
function fillEditForm(name, mail, phone, color) {
  document.getElementById("editName").value = name;
  document.getElementById("editMail").value = mail;
  document.getElementById("editPhone").value = phone;
}

/**
 * Displays the edit overlay and sets the avatar.
 * @param {string} name - The contact's name.
 * @param {string} color - The contact's color.
 */
function showEditOverlay(name, color) {
  const avatar = document.getElementById("editAvatar");
  avatar.textContent = getInitials(name);
  avatar.style.background = color;
  document.getElementById("editContactOverlay").classList.remove("hidden");
}

/**
 * Toggles the contact sidebar visibility.
 */
function toggleContactsSlider() {
  document.getElementById("contactsSlider").classList.toggle("open");
}

/**
 * Saves the currently edited contact and updates the UI.
 */
async function saveEditedContact() {
  if (!currentEditKey) {
    alert("No contact has been selected.");
    return;
  }

  const updatedContact = {
    name: document.getElementById("editName").value,
    mail: document.getElementById("editMail").value,
    phone_number: document.getElementById("editPhone").value,
    color: document.getElementById("editAvatar").style.background || getRandomColor()
  };

  try {
    await fetch(`${BASE_URL}contacts/${currentEditKey}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedContact)
    });

    closeEditContact();
    await fetchContacts();
    showContact(updatedContact, updatedContact.color, currentEditKey);
  } catch (error) {}
}

/**
 * Deletes a contact by key after confirmation.
 * @param {string} key - The contact's key.
 */
async function deleteContact(key) {
  if (!confirm("Do you really want to delete this contact?")) return;

  try {
    await fetch(`${BASE_URL}contacts/${key}.json`, {
      method: "DELETE"
    });

    document.getElementById("contactView").innerHTML = errorTamplate();
    await fetchContacts();
  } catch (error) {}
}

/**
 * Generates a valid key string from a name.
 * @param {string} name - The contact's name.
 * @returns {string} A lowercase, alphanumeric key.
 */
function generateKeyFromName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

/**
 * Creates and saves a new contact.
 */
async function createContact() {
  const name = getInputValue("contactName");
  const mail = getInputValue("contactEmail");
  const phone = getInputValue("contactPhone");

  if (!name || !mail || !phone) {
    alert("Bitte fülle alle Felder aus.");
    return;
  }

  const newContact = buildContactObject(name, mail, phone);
  const key = generateKeyFromName(name);
  await saveContact(key, newContact);
}

/**
 * Returns the trimmed value of an input field.
 * @param {string} id - The input element's ID.
 * @returns {string} Trimmed value.
 */
function getInputValue(id) {
  return document.getElementById(id).value.trim();
}

/**
 * Builds a contact object.
 * @param {string} name
 * @param {string} mail
 * @param {string} phone
 * @returns {Object} Contact object.
 */
function buildContactObject(name, mail, phone) {
  return {
    name: name,
    mail: mail,
    phone_number: phone,
    color: getRandomColor()
  };
}

/**
 * Saves a contact to the backend.
 * @param {string} key - The contact key.
 * @param {Object} contact - Contact data.
 */
async function saveContact(key, contact) {
  try {
    const response = await fetch(`${BASE_URL}contacts/${key}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contact)
    });

    if (!response.ok) {
      alert("Fehler beim Speichern.");
      return;
    }

    finishContactCreation();
  } catch (error) {}
}

/**
 * Finalizes the contact creation process.
 */
function finishContactCreation() {
  closeAddContact();
  clearAddContactFields();
  contactAddedSuccessfully();
  fetchContacts();
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

// Toggle sidebar menu
const contactsSlider = document.getElementById("contactsSlider");
const sliderTrigger = document.getElementById("sliderTrigger");

if (contactsSlider && sliderTrigger) {
  sliderTrigger.addEventListener("click", function (event) {
    event.stopPropagation();
    contactsSlider.classList.toggle("open");
  });

  document.addEventListener("click", function (event) {
    if (!contactsSlider.contains(event.target) && !sliderTrigger.contains(event.target)) {
      contactsSlider.classList.remove("open");
    }
  });
}
