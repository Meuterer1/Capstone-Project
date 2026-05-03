const contactSubmitBtn = document.getElementById(
  "contact-submit-btn",
) as HTMLButtonElement;
const contactForm = document.querySelector(".contact-form") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const topicInput = document.getElementById("topic") as HTMLInputElement;
const messageInput = document.getElementById("message") as HTMLTextAreaElement;
const formMessage = document.getElementById("form-message") as HTMLDivElement;

// Regex pattern for email validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Function to validate email format
function isValidEmail(email: string): boolean {
  return emailPattern.test(email);
}

// Function to display error message for a field
function displayError(fieldId: string, message: string): void {
  const errorElement = document.getElementById(
    `error-${fieldId}`,
  ) as HTMLSpanElement;
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = message ? "block" : "none";
    errorElement.style.color = "#B92770";
    errorElement.style.fontSize = "0.875rem";
    errorElement.style.marginTop = "0.25rem";
  }
}

// Function to clear all error messages
function clearErrors(): void {
  displayError("name", "");
  displayError("email", "");
  displayError("topic", "");
  displayError("message", "");
}

// Real-time validation for each field
nameInput?.addEventListener("input", () => {
  if (nameInput.value.trim() === "") {
    displayError("name", "Name is required");
  } else {
    displayError("name", "");
  }
  validateForm();
});

emailInput?.addEventListener("input", () => {
  const email = emailInput.value.trim();
  if (email === "") {
    displayError("email", "Email is required");
  } else if (!isValidEmail(email)) {
    displayError("email", "Please enter a valid email address");
  } else {
    displayError("email", "");
  }
  validateForm();
});

topicInput?.addEventListener("input", () => {
  if (topicInput.value.trim() === "") {
    displayError("topic", "Topic is required");
  } else {
    displayError("topic", "");
  }
  validateForm();
});

messageInput?.addEventListener("input", () => {
  if (messageInput.value.trim() === "") {
    displayError("message", "Message is required");
  } else {
    displayError("message", "");
  }
  validateForm();
});

// Function to validate entire form
function validateForm(): void {
  const isNameValid = nameInput?.value.trim() !== "";
  const isEmailValid =
    emailInput?.value.trim() !== "" && isValidEmail(emailInput?.value.trim());
  const isTopicValid = topicInput?.value.trim() !== "";
  const isMessageValid = messageInput?.value.trim() !== "";

  const isFormValid =
    isNameValid && isEmailValid && isTopicValid && isMessageValid;
  if (contactSubmitBtn) {
    contactSubmitBtn.disabled = !isFormValid;
  }
}

// Form submission handler
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  clearErrors();

  const name = nameInput?.value.trim();
  const email = emailInput?.value.trim();
  const topic = topicInput?.value.trim();
  const message = messageInput?.value.trim();

  // Final validation before submission
  let isValid = true;

  if (name === "") {
    displayError("name", "Name is required");
    isValid = false;
  }

  if (email === "") {
    displayError("email", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    displayError("email", "Please enter a valid email address");
    isValid = false;
  }

  if (topic === "") {
    displayError("topic", "Topic is required");
    isValid = false;
  }

  if (message === "") {
    displayError("message", "Message is required");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  // Show success message
  formMessage.textContent =
    "Thank you for your feedback! We will contact you soon.";
  formMessage.style.color = "#4CAF50";
  formMessage.style.marginTop = "1rem";
  formMessage.style.padding = "1rem";
  formMessage.style.backgroundColor = "#E8F5E9";
  formMessage.style.borderRadius = "4px";
  formMessage.style.border = "1px solid #4CAF50";

  // Reset form after 2 seconds
  setTimeout(() => {
    contactForm.reset();
    formMessage.textContent = "";
    clearErrors();
    validateForm();
  }, 2000);
});

// Initial form state
validateForm();
