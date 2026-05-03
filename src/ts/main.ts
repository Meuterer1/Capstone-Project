import "./about.js";
import "./cart.js";
import "./catalog.js";
import "./contact.js";
import "./home.js";
import "./product.js";

document.addEventListener("DOMContentLoaded", () => {
  const navToggleBtn =
    document.querySelector<HTMLButtonElement>(".nav-toggle-btn");
  const headerElement = document.querySelector("header");
  const logoButton = document.querySelector<HTMLButtonElement>(".logo-btn");
  const loginModalOverlay = createLoginModal();

  function createLoginModal() {
    const overlay = document.createElement("div");
    overlay.className = "login-modal-overlay hidden";
    overlay.innerHTML = `
      <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <div class="login-modal-header">
          <h2 id="login-modal-title">Log In</h2>
          <button type="button" class="login-modal-close" aria-label="Close login modal">×</button>
        </div>
        <div class="login-modal-body"></div>
      </div>
    `;

    document.body.append(overlay);

    const closeButton =
      overlay.querySelector<HTMLButtonElement>(".login-modal-close");
    closeButton?.addEventListener("click", closeLoginModal);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeLoginModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.classList.contains("hidden")) {
        closeLoginModal();
      }
    });

    return overlay;
  }

  function setupPasswordToggle() {
    const toggleButtons =
      loginModalOverlay.querySelectorAll<HTMLButtonElement>(".toggle-password");
    toggleButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const passwordField = button
          .closest(".password-wrapper")
          ?.querySelector<HTMLInputElement>("#password");
        if (!passwordField) return;

        const isPasswordHidden = passwordField.type === "password";
        passwordField.type = isPasswordHidden ? "text" : "password";
        button.setAttribute("aria-pressed", String(isPasswordHidden));
        button.setAttribute(
          "aria-label",
          isPasswordHidden ? "Hide password" : "Show password",
        );
      });
    });
  }

  function setupFormValidation() {
    const form =
      loginModalOverlay.querySelector<HTMLFormElement>(".login-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput = form.querySelector<HTMLInputElement>("#email");
      const passwordInput = form.querySelector<HTMLInputElement>("#password");

      if (!emailInput?.value || !passwordInput?.value) {
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (passwordInput.value.length === 0) {
        alert("Password is required.");
        return;
      }

      form.style.display = "none";
      const successMessage = document.createElement("div");
      successMessage.className = "login-success-message";
      successMessage.innerHTML =
        "<h3>Login successful!</h3><p>Welcome back.</p>";

      const modalBody =
        loginModalOverlay.querySelector<HTMLElement>(".login-modal-body");
      if (modalBody) {
        modalBody.appendChild(successMessage);
      }

      setTimeout(() => {
        closeLoginModal();
        form.style.display = "";
        form.reset();
      }, 2000);
    });
  }

  async function loadLoginModalContent() {
    const modalBody =
      loginModalOverlay.querySelector<HTMLElement>(".login-modal-body");
    if (!modalBody || modalBody.innerHTML.trim()) return;

    try {
      const response = await fetch("/html/login.html");
      if (!response.ok) throw new Error("Unable to load login content");

      const htmlText = await response.text();
      const parser = new DOMParser();
      const documentFragment = parser.parseFromString(htmlText, "text/html");
      const mainSection = documentFragment.querySelector("main.login-main");
      modalBody.innerHTML = mainSection
        ? mainSection.innerHTML
        : "<p>Unable to load login form.</p>";
      setupPasswordToggle();
      setupFormValidation();
    } catch {
      if (modalBody) {
        modalBody.innerHTML = "<p>Unable to load login form.</p>";
      }
    }
  }

  function openLoginModal() {
    loginModalOverlay.classList.remove("hidden");
    loginModalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLoginModal() {
    loginModalOverlay.classList.remove("open");
    loginModalOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  navToggleBtn?.addEventListener("click", () => {
    headerElement?.classList.toggle("nav-open");
    console.log("Navigation toggled");
  });

  document.querySelectorAll("header nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (headerElement?.classList.contains("nav-open")) {
        headerElement.classList.remove("nav-open");
      }
    });
  });

  logoButton?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/index.html";
  });

  document
    .querySelectorAll<HTMLButtonElement>('button[title="shopping-cart icon"]')
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/html/cart.html";
      });
    });

  document
    .querySelectorAll<HTMLButtonElement>('button[title="user icon"]')
    .forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        await loadLoginModalContent();
        openLoginModal();
      });
    });
});
