(function () {
  const WHATSAPP_NUMBER = "9779851234567";
  const form = document.querySelector('.contacts_form[data-type="contacts"]');
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = form.contactsFirstName.value.trim();
    const lastName = form.contactsLastName.value.trim();
    const email = form.contactsEmail.value.trim();
    const phone = form.contactsTel.value.trim();
    const message = form.contactsMessage.value.trim();

    const lines = [
      "New contact form message:",
      `Name: ${firstName} ${lastName}`.trim(),
      email && `Email: ${email}`,
      phone && `Phone: ${phone}`,
      message && `Message: ${message}`,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
    form.reset();
  });
})();
