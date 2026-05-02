import { Product } from "./catalog";

type CartOptions = {
  size?: string;
  color?: string;
  category?: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  options?: CartOptions;
};

const storageKey = "best-shop-cart";
let products: Product[] = [];
let cartItems: CartItem[] = [];

window.addEventListener("DOMContentLoaded", initCart);

async function initCart() {
  products = await fetchProducts();
  cartItems = loadCartItems();
  createCartBadge();
  updateCartCount();
  renderCartPage();
  bindCartEvents();
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch("../assets/data.json");
    if (!response.ok) {
      throw new Error("Unable to load product data.");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function loadCartItems(): CartItem[] {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as CartItem[];
  } catch {
    return [];
  }
}

function saveCartItems() {
  localStorage.setItem(storageKey, JSON.stringify(cartItems));
}

function createCartBadge() {
  document.querySelectorAll<HTMLButtonElement>("button[title='shopping-cart icon']").forEach((button) => {
    if (!button.querySelector(".cart-badge")) {
      const badge = document.createElement("span");
      badge.className = "cart-badge";
      button.style.position = "relative";
      button.appendChild(badge);
    }
  });
}

function updateCartCount() {
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll<HTMLSpanElement>(".cart-badge").forEach((badge) => {
    badge.textContent = count.toString();
    badge.style.display = count > 0 ? "inline-flex" : "none";
  });
}

function createCartItemKey(item: CartItem) {
  const size = item.options?.size ?? "any";
  const color = item.options?.color ?? "any";
  const category = item.options?.category ?? "any";
  return `${item.id}|${size}|${color}|${category}`;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function getDiscount(subtotal: number) {
  if (subtotal >= 3000) {
    return round(subtotal * 0.1);
  }

  return 0;
}

function getShipping(totalAfterDiscount: number) {
  if (totalAfterDiscount === 0) {
    return 0;
  }

  return totalAfterDiscount >= 150 ? 0 : 10;
}

function calculateTotals() {
  const subtotal = round(
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  );
  const discount = getDiscount(subtotal);
  const afterDiscount = round(subtotal - discount);
  const shipping = getShipping(afterDiscount);
  const total = round(afterDiscount + shipping);

  return { subtotal, discount, shipping, total };
}

function renderCartPage() {
  const cartItemsBody = document.querySelector<HTMLTableSectionElement>("#cart-items");
  if (!cartItemsBody) {
    return;
  }

  cartItemsBody.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsBody.innerHTML = `
      <tr class="empty-cart-row">
        <td colspan="6" class="empty-cart-message">
          Your cart is empty. Use the catalog to add new items.
        </td>
      </tr>
    `;

    updateCartSummary();
    return;
  }

  cartItems.forEach((item) => {
    const cartKey = createCartItemKey(item);
    const itemTotal = round(item.price * item.quantity);
    const optionsText = item.options
      ? `
        <div class="cart-item-options">
          ${item.options.size ? `<span>Size: ${item.options.size}</span>` : ""}
          ${item.options.color ? `<span>Color: ${item.options.color}</span>` : ""}
          ${item.options.category ? `<span>Category: ${item.options.category}</span>` : ""}
        </div>
      `
      : "";

    const row = document.createElement("tr");
    row.dataset.cartKey = cartKey;
    row.innerHTML = `
      <td>
        <img src="${item.imageUrl}" alt="${item.name}" />
      </td>
      <td>
        <div class="cart-item-name">${item.name}</div>
        ${optionsText}
      </td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <div class="table-quantuty">
          <button class="quantity-btn btn" data-action="decrease" data-key="${cartKey}">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn btn" data-action="increase" data-key="${cartKey}">+</button>
        </div>
      </td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td>
        <button class="icon-btn btn remove-cart-item" title="delete" data-key="${cartKey}">
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 5H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17 5V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5M6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8 10V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 10V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </td>
    `;

    cartItemsBody.appendChild(row);
  });

  updateCartSummary();
}

function updateCartSummary() {
  const subtotalNode = document.getElementById("subtotal-amount");
  const discountNode = document.getElementById("discount-amount");
  const shippingNode = document.getElementById("shipping-amount");
  const totalNode = document.getElementById("total-amount");
  const messageNode = document.getElementById("checkout-message");

  const { subtotal, discount, shipping, total } = calculateTotals();

  if (subtotalNode) {
    subtotalNode.textContent = `$${subtotal.toFixed(2)}`;
  }

  if (discountNode) {
    discountNode.textContent = discount > 0 ? `-$${discount.toFixed(2)}` : "$0.00";
  }

  if (shippingNode) {
    shippingNode.textContent = shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`;
  }

  if (totalNode) {
    totalNode.textContent = `$${total.toFixed(2)}`;
  }

  if (messageNode && cartItems.length === 0) {
    messageNode.textContent = "Your shopping cart is empty.";
  }
}

function findCartItemIndex(key: string) {
  return cartItems.findIndex((item) => createCartItemKey(item) === key);
}

function addCartItem(productId: string, options: CartOptions = {}, quantity = 1) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    return;
  }

  const item: CartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    quantity,
    options,
  };

  const key = createCartItemKey(item);
  const existingIndex = findCartItemIndex(key);

  if (existingIndex >= 0) {
    cartItems[existingIndex].quantity += quantity;
  } else {
    cartItems.push(item);
  }

  saveCartItems();
  updateCartCount();
  renderCartPage();
  showCartNotification(`${product.name} added to cart.`);
}

function removeCartItem(key: string) {
  const index = findCartItemIndex(key);
  if (index < 0) {
    return;
  }

  cartItems.splice(index, 1);
  saveCartItems();
  updateCartCount();
  renderCartPage();
  showCartNotification("Item removed from your cart.");
}

function changeCartItemQuantity(key: string, delta: number) {
  const index = findCartItemIndex(key);
  if (index < 0) {
    return;
  }

  cartItems[index].quantity += delta;

  if (cartItems[index].quantity <= 0) {
    cartItems.splice(index, 1);
  }

  saveCartItems();
  updateCartCount();
  renderCartPage();
}

function clearCartItems() {
  cartItems = [];
  saveCartItems();
  updateCartCount();
  renderCartPage();
  showCartNotification("Shopping cart cleared.");
}

function checkoutCart() {
  if (cartItems.length === 0) {
    showCartNotification("Add items to your cart before checkout.");
    return;
  }

  clearCartItems();
  showCartNotification("Thank you for your purchase.");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindCartEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const addButton = target.closest<HTMLButtonElement>(".add-to-cart-btn");

    if (addButton) {
      event.preventDefault();
      const productId = addButton.dataset.productId;
      if (!productId) {
        return;
      }

      const productCard = addButton.closest(".product-cart-info") || addButton.closest(".product-card");
      const quantityValue = productCard?.querySelector<HTMLElement>('#quantity-value')?.textContent ?? "1";
      const quantity = Number(quantityValue) || 1;
      const size = productCard?.querySelector<HTMLSelectElement>("#size")?.value;
      const color = productCard?.querySelector<HTMLSelectElement>("#color")?.value;
      const category = productCard?.querySelector<HTMLSelectElement>("#category")?.value;

      addCartItem(productId, { size, color, category }, quantity);
      return;
    }

    const quantityButton = target.closest<HTMLButtonElement>("button[data-action]");
    if (quantityButton && quantityButton.dataset.key) {
      event.preventDefault();
      const key = quantityButton.dataset.key;
      const action = quantityButton.dataset.action;

      if (action === "increase") {
        changeCartItemQuantity(key, 1);
      } else if (action === "decrease") {
        changeCartItemQuantity(key, -1);
      }

      return;
    }

    const removeButton = target.closest<HTMLButtonElement>(".remove-cart-item");
    if (removeButton && removeButton.dataset.key) {
      event.preventDefault();
      removeCartItem(removeButton.dataset.key);
      return;
    }

    const clearButton = target.closest<HTMLButtonElement>("#clear-cart");
    if (clearButton) {
      event.preventDefault();
      clearCartItems();
      return;
    }

    const checkoutButton = target.closest<HTMLButtonElement>("#checkout-btn");
    if (checkoutButton) {
      event.preventDefault();
      checkoutCart();
      return;
    }

    const continueButton = target.closest<HTMLButtonElement>("#continue-shopping");
    if (continueButton) {
      event.preventDefault();
      window.location.href = "/index.html";
      return;
    }
  });
}

function showCartNotification(message: string) {
  const notification = document.getElementById("checkout-message");

  if (!notification) {
    return;
  }

  notification.textContent = message;
  notification.classList.add("active");

  window.setTimeout(() => {
    notification.classList.remove("active");
  }, 4000);
}
