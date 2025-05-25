async function initContacts() {
  await fetchContacts();
  initTask();
}

async function fetchContacts() {
  try {
    const data = await getAllUsers("contacts");

    if (!data) {
      document.getElementById("contactList").innerHTML = "<p>Keine Kontakte gefunden.</p>";
      return;
    }

    const contacts = Object.values(data);
    renderContacts(contacts);
  } catch (error) {
    console.error("", error);
  }
}

async function getAllUsers(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}
function renderContacts(contacts) {
  const list = document.getElementById("contactList");
  list.innerHTML = "";

  contacts.sort((a, b) => a.name.localeCompare(b.name));

  let currentGroup = "";

  contacts.forEach((contact, index) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();

    if (firstLetter !== currentGroup) {
      currentGroup = firstLetter;

      const groupHeader = document.createElement("div");
      groupHeader.classList.add("contact-group-header");
      groupHeader.textContent = currentGroup;
      list.appendChild(groupHeader);
    }

    const color = getRandomColor();
    const div = document.createElement("div");
    div.classList.add("contact-div");
    div.innerHTML = `
      <span class="contact-avatar" style="background:${color}">${getInitials(contact.name)}</span>
      <div>
        <p class="contacts-name">${contact.name}</p><br>
        <p class="contacts-mail">${contact.mail}</p>
      </div>
    `;
    div.addEventListener("click", () => showContact(contact, color));
    list.appendChild(div);
  });
}

function getInitials(name) {
  return name.split(" ").map(n => n[0].toUpperCase()).join("");
}

function getRandomColor() {
  const colors = ["orange", "blue", "purple", "teal", "pink", "green"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function showContact(contact, color) {
  document.getElementById("contactView").innerHTML = `
    <div class="contact-view">
      <div class="contact-info">
        <div class="contact-avatar" style="background:${color}; width:120px; height:120px; font-size:47px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; color: white;">
          ${getInitials(contact.name)}
        </div>
        <div class="contact-name-buttons">
          <h2>${contact.name}</h2>          
          <button onclick="openEditContact()"><img src="../assets/icons/edit-v2.png" alt="">Edit</button>          
          <button><img src="../assets/icons/delete.png" alt="">Delete</button>
        </div>
      </div>
      <p class="contact-info-subtitle">Contact Information</p>
      <div class="contact-details">        
        <p><strong>Email:</strong><br><br> <a href="mailto:${contact.mail}">${contact.mail}</a></p><br><br>
        <p><strong>Phone:</strong><br><br> ${contact.phone_number || '-'}</p>
      </div>
    </div>
  `;
}

function openAddContact() {
  document.getElementById("addContactOverlay").classList.remove("hidden");
}

function closeAddContact() {
  document.getElementById("addContactOverlay").classList.add("hidden");
}

function openEditContact() {
  document.getElementById("editContactOverlay").classList.remove("hidden");
}

function closeEditContact() {
  document.getElementById("editContactOverlay").classList.add("hidden");
}
