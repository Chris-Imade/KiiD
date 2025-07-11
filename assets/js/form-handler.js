document.addEventListener("DOMContentLoaded", () => {
  // Create loader and message elements
  createUIElements();

  // Handle the newsletter subscription form
  const newsletterForms = document.querySelectorAll(".ul-nwsltr-form");
  newsletterForms.forEach((form) => {
    form.addEventListener("submit", handleNewsletterSubmit);
  });

  // Handle contact form
  const contactForm = document.querySelector(".ul-contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
});

function createUIElements() {
  // Create loader overlay
  const loaderOverlay = document.createElement("div");
  loaderOverlay.className = "loader-overlay";
  loaderOverlay.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(loaderOverlay);

  // Create success message
  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  document.body.appendChild(successMessage);

  // Create error message
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  document.body.appendChild(errorMessage);
}

function showLoader() {
  document.querySelector(".loader-overlay").classList.add("active");
}

function hideLoader() {
  document.querySelector(".loader-overlay").classList.remove("active");
}

function showMessage(type, message, duration = 5000) {
  const element = document.querySelector(`.${type}-message`);
  element.textContent = message;
  element.classList.add("active");

  setTimeout(() => {
    element.classList.remove("active");
  }, duration);
}

async function handleNewsletterSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const emailInput = form.querySelector('input[name="email"]');
  const agreementInput = form.querySelector('input[name="agreement"]');

  if (!emailInput.value) {
    showMessage("error", "Please enter your email address");
    return;
  }

  if (agreementInput && !agreementInput.checked) {
    showMessage("error", "Please agree to the Privacy Policy");
    return;
  }

  showLoader();

  try {
    const response = await fetch(
      "https://kiid-server.onrender.com/api/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value,
          agreement: agreementInput ? agreementInput.checked : true,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showMessage("success", "Thank you for subscribing to our newsletter!");
      form.reset();
    } else {
      showMessage(
        "error",
        data.message || "An error occurred. Please try again."
      );
    }
  } catch (error) {
    showMessage(
      "error",
      "Unable to connect to the server. Please try again later."
    );
    console.error("Error:", error);
  } finally {
    hideLoader();
  }
}

async function handleContactSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const subjectInput = form.querySelector('input[name="subject"]');
  const messageInput = form.querySelector('textarea[name="message"]');

  if (
    !nameInput.value ||
    !emailInput.value ||
    !subjectInput.value ||
    !messageInput.value
  ) {
    showMessage("error", "Please fill in all fields");
    return;
  }

  showLoader();

  try {
    const response = await fetch(
      "https://kiid-server.onrender.com/api/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameInput.value,
          email: emailInput.value,
          subject: subjectInput.value,
          message: messageInput.value,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showMessage("success", "Your message has been sent successfully!");
      form.reset();
    } else {
      showMessage(
        "error",
        data.message || "An error occurred. Please try again."
      );
    }
  } catch (error) {
    showMessage(
      "error",
      "Unable to connect to the server. Please try again later."
    );
    console.error("Error:", error);
  } finally {
    hideLoader();
  }
}
