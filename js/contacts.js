const firebaseConfig = {
  apiKey: "AIzaSyA5LRioD4v-9RP0IbH2y-9vaU6Z4m5hk5o",
  authDomain: "join-13fcf.firebaseapp.com",
  databaseURL:"https://join-13fcf-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-13fcf",
  storageBucket: "join-13fcf.firebasestorage.app",
  messagingSenderId: "60079391606",
  appId: "1:60079391606:web:53707b5edad6f36dd7f057",
};
firebase.initializeApp(firebaseConfig);

function initContacts() {
  loadContacts();
  initTask();
}

function loadContacts() {
  const dbRef = firebase.database().ref("contacts");
  dbRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      renderContacts(data);
    } else {
      document.getElementById("contactList").innerHTML =
        "<p>Keine Kontakte gefunden.</p>";
    }
  });
}

function renderContacts(contactsObj) {
  const list = document.getElementById("contactList");
  list.innerHTML = "";

  Object.entries(contactsObj).forEach(([key, contact], index) => {
    const color = getRandomColor();
    const div = document.createElement("div");
    div.classList.add("contact-entry");
    div.innerHTML = `
      <span class="contact-avatar" style="background:${color}">${getInitials(
      contact.name
    )}</span>
      <strong>${contact.name}</strong><br/>
      <small>${contact.mail}</small>
    `;
    div.addEventListener("click", () => showContact(contact, color, index));
    list.appendChild(div);
  });
}

function showContact(contact, color, index) {
  document.getElementById("contactView").innerHTML = `
    <div class="contact-avatar" style="background:${color};width:60px;height:60px;font-size:20px;">
      ${getInitials(contact.name)}
    </div>
    <h2>${contact.name}</h2>
    <p><strong>Email:</strong> <a href="mailto:${contact.mail}">${
    contact.mail
  }</a></p>
    <p><strong>Phone:</strong> ${contact.phone_number}</p>
    <button>Edit</button>
    <button>Delete</button>
  `;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function getRandomColor() {
  const colors = ["orange", "blue", "purple", "teal", "pink"];
  return colors[Math.floor(Math.random() * colors.length)];
}
