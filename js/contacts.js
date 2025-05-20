const BASE_URL = "https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app/";

async function initContacts() {
  await fetchContacts();
  initTask();
}

async function fetchContacts() {
  try {
    const data = await getAll("contacts");

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

async function getAll(path) {
  const response = await fetch(BASE_URL + path + ".json");
  if (!response.ok) throw new Error("");
  return await response.json();
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
    <div class="contact-avatar" style="background:${color}; width:60px; height:60px; font-size:20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; color: white;">
      ${getInitials(contact.name)}
    </div>
    <h2>${contact.name}</h2>
    <p><strong>Email:</strong> <a href="mailto:${contact.mail}">${contact.mail}</a></p>
    <p><strong>Phone:</strong> ${contact.phone_number || '-'}</p>
    <button>Edit</button>
    <button>Delete</button>
  `;
}