const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitPattern = /^\+?\d[\d\s\-()]{6,19}$/;

/** @type {string|null} Currently selected contact key for editing */
let currentEditKey = null;

async function initContacts() {
  await fetchContacts();
  initTask();
  highlightLink();
}

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

async function getAllUsers(path) {
  const response = await fetch(BASE_URL + path + ".json");
  return await response.json();
}

function highlightLink() {
  const currentLink = document.getElementById('contacts');
  currentLink.classList.add('activeLink');
}

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

function appendGroupHeader(list, groupLetter) {
  const groupHeader = document.createElement("div");
  groupHeader.classList.add("contact-group-header");
  groupHeader.textContent = groupLetter;
  list.appendChild(groupHeader);

  const highlightDiv = document.createElement("div");
  highlightDiv.classList.add("contact-group-highlight");
  list.appendChild(highlightDiv);
}

function showCurrentContact(id) {
  const prev = document.querySelector(".CurrentContact");
  if (prev) prev.classList.remove("CurrentContact");

  const current = document.getElementById(id);
  if (current) current.classList.add("CurrentContact");
}

function getInitials(name) {
  return name.split(" ").map(n => n[0].toUpperCase()).join("");
}

function getRandomColor() {
  const colors = ["#6E52FF", "#FFA35E", "#FFE62B", "#00BEE8", "#FF5EB3", "#FFBB2B", "#FF745E", "#C3FF2B", "#FF7A00", "#1FD7C1", "#0038FF", "#FFC701", "#9327FF", "#FC71FF", "#FF4646"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function backToList() {
  document.getElementById("contactDetails").classList.remove("show");
  document.querySelector(".contacts-list").classList.add("show");
}

function openAddContact() {
  document.getElementById("addContactOverlay").classList.remove("hidden");
}

function closeAddContact() {
  document.getElementById("addContactOverlay").classList.add("hidden");
  clearAddContactFields();
}

function openEditContact() {
  document.getElementById("editContactOverlay").classList.remove("hidden");
}

function closeEditContact() {
  document.getElementById("editContactOverlay").classList.add("hidden");
}

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

async function fetchContactByKey(key) {
  const response = await fetch(`${BASE_URL}contacts/${key}.json`);
  return await response.json();
}

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

function fillEditForm(name, mail, phone, color) {
  document.getElementById("editName").value = name;
  document.getElementById("editMail").value = mail;
  document.getElementById("editPhone").value = phone;
}

function showEditOverlay(name, color) {
  const avatar = document.getElementById("editAvatar");
  avatar.textContent = getInitials(name);
  avatar.style.background = color;
  document.getElementById("editContactOverlay").classList.remove("hidden");
}

function toggleContactsSlider() {
  document.getElementById("contactsSlider").classList.toggle("open");
}

async function CheckEditedContact() {
  const name = document.getElementById("editName").value;
  const mail = document.getElementById("editMail").value;
  const phone = document.getElementById("editPhone").value;
  const color = document.getElementById("editAvatar").style.background || getRandomColor();

  if (!name || !mail || !phone) {
    alertEdit();
    return;
  }

  if (!emailPattern.test(mail)) {
    alertValidMailEdit();
    return;
  }

  if (!digitPattern.test(phone)) {
    alertValidNumberEdit();
    return;
  }

  const updatedContact = {
    name: name,
    mail: mail,
    phone_number: phone,
    color: color
  };

  await saveEditedContact(updatedContact);
}

async function saveEditedContact(updatedContact) {
  try {
    await fetch(`${BASE_URL}contacts/${currentEditKey}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedContact)
    });

    closeEditContact();
    await fetchContacts();
    showContact(updatedContact, updatedContact.color, currentEditKey);
  } catch (error) {}
}

async function deleteContact(key) {
  try {
    await fetch(`${BASE_URL}contacts/${key}.json`, { method: "DELETE" });
    document.getElementById("contactView").innerHTML = errorTamplate();
    await fetchContacts();
  } catch (error) {}
}

function generateKeyFromName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

async function createContact() {
  const name = getInputValue("contactName");
  const mail = getInputValue("contactEmail");
  const phone = getInputValue("contactPhone");

  if (!name || !mail || !phone) {
    alert();
    return;
  }
  if (!emailPattern.test(mail)) {
    alertValidMail();
    return;
  }
  if (!digitPattern.test(phone)) {
    alertValidNumber();
    return;
  }
  createNewContact(name, mail, phone);
}

async function createNewContact(name, mail, phone) {
  const newContact = buildContactObject(name, mail, phone);
  const key = generateKeyFromName(name);
  await saveContact(key, newContact);
}

function getInputValue(id) {
  return document.getElementById(id).value.trim();
}

function buildContactObject(name, mail, phone) {
  return {
    name: name,
    mail: mail,
    phone_number: phone,
    color: getRandomColor()
  };
}

async function saveContact(key, contact) {
  try {
    const response = await fetch(`${BASE_URL}contacts/${key}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact)
    });

    if (!response.ok) {
      alert("Fehler beim Speichern.");
      return;
    }

    finishContactCreation();
  } catch (error) {}
}

function finishContactCreation() {
  closeAddContact();
  clearAddContactFields();
  contactAddedSuccessfully();
  fetchContacts();
}

function closeOverlayByElement(overlayId) {
  const overlay = document.getElementById(overlayId);
  if (overlay) overlay.classList.add("hidden");
}

document.addEventListener("click", function (event) {
  const openOverlays = document.querySelectorAll(".overlay:not(.hidden)");

  openOverlays.forEach(overlay => {
    if (event.target === overlay) {
      overlay.classList.add("hidden");
    }
  });
});

const contactsSlider = document.getElementById("contactsSlider");
const sliderTrigger = document.getElementById("sliderTrigger");

if (contactsSlider && sliderTrigger) {
  sliderTrigger.addEventListener("click", function (event) {
    event.stopPropagation();
    contactsSlider.classList.toggle("dnone");
  });

  document.addEventListener("click", function (event) {
    const isClickOutside =
      !contactsSlider.contains(event.target) &&
      !sliderTrigger.contains(event.target);

    if (isClickOutside && !contactsSlider.classList.contains("dnone")) {
      contactsSlider.classList.add("dnone");
    }
  });
}

function deleteCurrentContact() {
  if (currentEditKey) {
    deleteContact(currentEditKey);
    closeEditContact();
  }
}


