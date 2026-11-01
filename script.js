const contactForm = document.getElementById("contact-form");

if (contactForm instanceof HTMLFormElement) {
  const feedback = document.getElementById("contact-form-feedback");
  const submitButton = contactForm.querySelector('button[type="submit"]');

  if (feedback && submitButton instanceof HTMLButtonElement) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (submitButton.disabled) {
        return;
      }

      const formData = new FormData(contactForm);
      const payload = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
      };

      submitButton.disabled = true;

      try {
        const response = await fetch(
          "https://eqfxkupu9c.execute-api.eu-west-2.amazonaws.com/prod/contact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error(`Contact request failed with status ${response.status}`);
        }

        feedback.textContent = "Thanks! Your message has been sent.";
        contactForm.reset();
      } catch {
        feedback.textContent =
          "Sorry, your message could not be sent. Please try again later.";
      } finally {
        submitButton.disabled = false;
      }
    });
  }
}
