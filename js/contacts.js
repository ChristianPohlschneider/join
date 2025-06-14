let currentEditKey = null;

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

    renderContacts(data);
  } catch (error) {
  }
}

async function getAllUsers(path) {
  const response = await fetch(BASE_URL + path + ".json");
  return await response.json();
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
      const groupHeader = document.createElement("div");
      groupHeader.classList.add("contact-group-header");
      groupHeader.textContent = currentGroup;
      list.appendChild(groupHeader);

      const highlightDiv = document.createElement("div");
      highlightDiv.classList.add("contact-group-highlight");
      list.appendChild(highlightDiv);
    }

    const color = contact.color || getRandomColor();
  const div = document.createElement("div");
div.classList.add("contact-div");
div.setAttribute("id", key);
div.setAttribute("onclick", `showCurrentContact('${key}')`);
    div.innerHTML = `
      <span class="contact-avatar" style="background:${color}">${getInitials(contact.name)}</span>
      <div>
        <p class="contacts-name">${contact.name}</p>
        <p class="contacts-mail">${contact.mail}</p>
      </div>
    `;
    div.addEventListener("click", () => showContact(contact, color, key));
    list.appendChild(div);
  });

}

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

function showContact(contact, color, key) {
  document.getElementById("contactView").innerHTML = `
    <div class="contact-view">
      <div class="contact-info">
        <div class="contact-avatar" style="background:${color}; width:120px; height:120px; font-size:47px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; color: white;">
          ${getInitials(contact.name)}
        </div>
        <div class="contact-name-buttons">
          <h2>${contact.name}</h2>
          <button onclick="editContact('${key}')"><img src="../assets/icons/edit-v2.png" alt="">Edit</button>
          <button onclick="deleteContact('${key}')"><img src="../assets/icons/delete.png" alt="">Delete</button>
        </div>
      </div>
      <p class="contact-info-subtitle">Contact Information</p>
      <div class="contact-info-block">        
        <p><strong>Email:</strong><br><br> <a href="mailto:${contact.mail}">${contact.mail}</a></p><br><br>
        <p><strong>Phone:</strong><br><br> ${contact.phone_number || '-'}</p>
      </div>
    </div>
  `;

  const editBtn = document.querySelector("#contactsSlider .edit-menu-btn");
  const deleteBtn = document.querySelector("#contactsSlider .delete-menu-btn");

  if (editBtn) editBtn.onclick = () => editContact(key);
  if (deleteBtn) deleteBtn.onclick = () => deleteContact(key);

  if (window.innerWidth < 930) {
    document.querySelector(".contacts-list").classList.remove("show");
    document.getElementById("contactDetails").classList.add("show");
  }
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
  currentEditKey = null;
}

async function editContact(key) {
  try {
    const response = await fetch(`${BASE_URL}contacts/${key}.json`);
    const contact = await response.json();

    if (!contact) {
      alert("Kontakt nicht gefunden.");
      return;
    }

    const name = contact.name || "";
    const mail = contact.mail || "";
    const phone = contact.phone_number || "";
    let color = contact.color;

    if (!color) {
      color = getRandomColor();
      await fetch(`${BASE_URL}contacts/${key}/color.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(color)
      });
    }

    document.getElementById("editName").value = name;
    document.getElementById("editMail").value = mail;
    document.getElementById("editPhone").value = phone;

    currentEditKey = key;

    const avatar = document.getElementById("editAvatar");
    avatar.textContent = getInitials(name);
    avatar.style.background = color;

    document.getElementById("editContactOverlay").classList.remove("hidden");
  } catch (error) {
  }
}

async function saveEditedContact() {
  if (!currentEditKey) {
    alert("Kein Kontakt ausgewählt.");
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
  } catch (error) {
  }
}

async function deleteContact(key) {
  if (!confirm("Möchtest du diesen Kontakt wirklich löschen?")) return;

  try {
    await fetch(`${BASE_URL}contacts/${key}.json`, {
      method: "DELETE"
    });

    document.getElementById("contactView").innerHTML = "<p>Wähle einen Kontakt aus der Liste.</p>";
    await fetchContacts();
  } catch (error) {
  }
}

function generateKeyFromName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

async function createContact() {
  const name = document.getElementById("contactName").value.trim();
  const mail = document.getElementById("contactEmail").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();

  if (!name || !mail || !phone) {
    alert("Bitte fülle alle Felder aus.");
    return;
  }

  const newContact = {
    name: name,
    mail: mail,
    phone_number: phone,
    color: getRandomColor()
  };

  const key = generateKeyFromName(name);

  try {
    const response = await fetch(`${BASE_URL}contacts/${key}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newContact)
    });

    if (!response.ok) {
      alert("Fehler beim Speichern.");
      return;
    }

    closeAddContact();
    clearAddContactFields();
    contactAddedSuccessfully();
    await fetchContacts();
  } catch (error) {
  }
}

function contactAddedSuccessfully() {
  const feedbackEl = document.getElementById("userFeedback");
  feedbackEl.classList.remove("hidden");

  setTimeout(() => {
    feedbackEl.classList.add("hidden");
  }, 4000);
}

function clearAddContactFields() {
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactPhone").value = "";
}

function deleteCurrentContact() {
  if (currentEditKey) {
    deleteContact(currentEditKey);
    closeEditContact();
  }
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
    contactsSlider.classList.toggle("open");
  });

  document.addEventListener("click", function (event) {
    if (!contactsSlider.contains(event.target) && !sliderTrigger.contains(event.target)) {
      contactsSlider.classList.remove("open");
    }
  });
}

