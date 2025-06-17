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