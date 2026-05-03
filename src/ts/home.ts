import { Product } from "./catalog";

let products: Product[] = [];

async function init() {
  products = await fetchProducts();
  renderSelectedProducts();
  renderNewProductsArrival();
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch("../assets/data.json");
    if (!response.ok) throw new Error("Unable to load products");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function renderSelectedProducts() {
  const container = document.querySelector(".selected-products .card-box");
  if (!container) return;

  const shuffled = [...products].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);

  container.innerHTML = "";
  selected.forEach((product) => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

function renderNewProductsArrival() {
  const container = document.querySelector(".new-products-arrival .card-box");
  if (!container) return;

  const shuffled = [...products].sort(() => 0.5 - Math.random());
  const newProducts = shuffled.slice(0, 4);

  container.innerHTML = "";
  newProducts.forEach((product) => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

function createProductCard(product: Product): HTMLElement {
  const card = document.createElement("div");
  card.className = "product-card";
  if (product.salesStatus) {
    card.classList.add("sale");
  }

  card.innerHTML = `
    <span class="sale">SALE</span>
    <img src="${product.imageUrl}" alt="${product.name}" />
    <h4>${product.name}</h4>
    <h4>$${product.price.toFixed(2)}</h4>
    <button class="btn add-to-cart-btn" data-product-id="${product.id}">Add To Cart</button>
  `;

  card.addEventListener("click", (e) => {
    if ((e.target as HTMLElement)?.classList.contains("add-to-cart-btn")) {
      return;
    }
    window.location.href = `/html/product-details.html?id=${product.id}`;
  });

  return card;
}

init();
