import './about.js';
import './cart.js';
import './catalog.js';
import './contact.js';
import './home.js';
import './product.js';

document.addEventListener('DOMContentLoaded', () => {
  const navToggleBtn = document.querySelector<HTMLButtonElement>('.nav-toggle-btn');
  const headerElement = document.querySelector('header');
  const logoButton = document.querySelector<HTMLButtonElement>('.logo-btn');

  navToggleBtn?.addEventListener('click', () => {
    headerElement?.classList.toggle('nav-open');
  });

  document.querySelectorAll('header nav a').forEach((link) => {
    link.addEventListener('click', () => {
      if (headerElement?.classList.contains('nav-open')) {
        headerElement.classList.remove('nav-open');
      }
    });
  });

  logoButton?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/index.html';
  });

  document.querySelectorAll<HTMLButtonElement>('button[title="shopping-cart icon"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/html/cart.html';
    });
  });

  document.querySelectorAll<HTMLButtonElement>('button[title="user icon"]').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openLoginModal();
    });
  });

  function openLoginModal() {
    const existingModal = document.getElementById('login-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'login-modal';
    modal.id = 'login-modal';
    modal.innerHTML = `
      <div class="login-modal-content">
        <button class="modal-close" aria-label="Close login">&times;</button>
        <h2>Log In</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
            <span class="login-error" id="email-error"></span>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input type="password" id="password" name="password" required />
              <button type="button" class="toggle-password" aria-label="Toggle password visibility">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3C5 3 1 7 1 10s4 7 9 7 9-4 9-7-4-7-9-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor" />
                  <path d="M10 6c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" fill="currentColor" />
                </svg>
              </button>
            </div>
            <span class="login-error" id="password-error"></span>
          </div>
          <button type="submit" class="btn">Log In</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector<HTMLButtonElement>('.modal-close');
    const form = modal.querySelector<HTMLFormElement>('#login-form');
    const emailInput = modal.querySelector<HTMLInputElement>('#email');
    const passwordInput = modal.querySelector<HTMLInputElement>('#password');
    const togglePasswordBtn = modal.querySelector<HTMLButtonElement>('.toggle-password');

    closeBtn?.addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    togglePasswordBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      const type = passwordInput?.type === 'password' ? 'text' : 'password';
      if (passwordInput) passwordInput.type = type;
    });

    emailInput?.addEventListener('blur', () => {
      validateEmail();
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateEmail() && validatePassword()) {
        modal.remove();
      }
    });

    function validateEmail(): boolean {
      const value = emailInput?.value || '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const errorEl = modal.querySelector<HTMLSpanElement>('#email-error');
      if (!emailRegex.test(value)) {
        if (errorEl) errorEl.textContent = 'Please enter a valid email address';
        return false;
      }
      if (errorEl) errorEl.textContent = '';
      return true;
    }

    function validatePassword(): boolean {
      const value = passwordInput?.value || '';
      const errorEl = modal.querySelector<HTMLSpanElement>('#password-error');
      if (!value) {
        if (errorEl) errorEl.textContent = 'Password is required';
        return false;
      }
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }
});

