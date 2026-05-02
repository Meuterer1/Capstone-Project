
import { Product } from "./catalog";

let items: Product[] = [];
const contentNameDetails = document.getElementById("content-name-details") as HTMLHeadingElement;
const contentNameReviews = document.getElementById("content-name-reviews") as HTMLHeadingElement;
const contentNameShipping = document.getElementById("content-name-shipping") as HTMLHeadingElement;
const contentDetails = document.getElementById("content-details") as HTMLDivElement;
const reviesContainer = document.getElementById("reviews") as HTMLDivElement;
const detailsContainer = document.getElementById("details") as HTMLDivElement;

contentNameDetails.addEventListener("click", () => {
    detailsContainer.classList.add("active");
    reviesContainer.classList.remove("active");
    contentNameShipping.classList.remove("active");
});

contentNameReviews.addEventListener("click", () => {
    detailsContainer.classList.remove("active");
    reviesContainer.classList.add("active");
    contentNameShipping.classList.remove("active");
    
    const reviewForm = document.querySelector<HTMLFormElement>(".review-form");
    if (reviewForm) {
      reviewForm.addEventListener("submit", handleReviewSubmit);
    }
});

contentNameShipping.addEventListener("click", () => {
    detailsContainer.classList.remove("active");
    reviesContainer.classList.remove("active");
    contentNameShipping.classList.add("active");
    contentDetails.textContent = "We offer free standard shipping on all orders within the continental United States. Expedited shipping options are available at checkout for an additional fee. International shipping is also available, with rates calculated at checkout based on destination.";
});

function handleReviewSubmit(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const reviewText = form.querySelector<HTMLTextAreaElement>("textarea[name='review']")?.value || "";

  if (!reviewText.trim()) {
    showReviewMessage("Please write a review.", "error");
    return;
  }

  showReviewMessage("Thank you! Your review has been submitted.", "success");
  form.reset();
}

function showReviewMessage(message: string, type: "success" | "error") {
  let messageEl = document.querySelector<HTMLDivElement>(".review-message");
  if (!messageEl) {
    messageEl = document.createElement("div");
    messageEl.className = "review-message";
    document.querySelector(".add-review")?.appendChild(messageEl);
  }

  messageEl.textContent = message;
  messageEl.className = `review-message ${type}`;
  messageEl.style.display = "block";

  setTimeout(() => {
    messageEl!.style.display = "none";
  }, 4000);
}


init();



// Functions

async function init() {
  items = await getData();
  const productId = getProductIdFromUrl();

    if (productId) {
        const product = items.find(item => item.id === productId);

        if (product) {
            generateProductCart(product);
        }
    }

    generateYouMayAlsoLike()
}

async function getData(): Promise<Product[]> {
  const res = await fetch("../assets/data.json");

  if (!res.ok) throw new Error("Błąd ładowania danych");

  const data = await res.json();
  return data.data;
}

function getProductIdFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
}

function generateProductCart(product: Product) {
    const productCartName = document.getElementById("product-cart-name") as HTMLHeadingElement;
    const productCartStars = document.getElementById("product-cart-stars") as HTMLDivElement;
    const productCartPrice = document.getElementById("product-cart-price") as HTMLHeadingElement;
    const productCartDescription = document.getElementById("product-cart-description") as HTMLParagraphElement;

    const start = generateStars(product.rating);

    productCartName.textContent = product.name;
    productCartStars.innerHTML = start;
    productCartPrice.textContent = `$${product.price.toFixed(2)}`;
    productCartDescription.textContent = `The new ${product.name} is a bold reimagining of travel essentials, designed to elevate every journey. Made with at least 30% recycled materials, its lightweight yet impact-resistant shell combines eco-conscious innovation with rugged durability.`;

    const addToCartButton = document.querySelector<HTMLButtonElement>(".add-to-cart-btn");
    const quantityValue = document.getElementById("quantity-value") as HTMLElement | null;
    const decreaseButton = document.getElementById("decrease") as HTMLButtonElement | null;
    const increaseButton = document.getElementById("increase") as HTMLButtonElement | null;
    const sizeSelect = document.getElementById("size") as HTMLSelectElement | null;
    const colorSelect = document.getElementById("color") as HTMLSelectElement | null;
    const categorySelect = document.getElementById("category") as HTMLSelectElement | null;

    let quantity = 1;
    if (quantityValue) {
      quantityValue.textContent = quantity.toString();
    }

    if (addToCartButton) {
      addToCartButton.dataset.productId = product.id;
    }

    decreaseButton?.addEventListener("click", () => {
      if (quantity > 1) {
        quantity -= 1;
        if (quantityValue) quantityValue.textContent = quantity.toString();
      }
    });

    increaseButton?.addEventListener("click", () => {
      quantity += 1;
      if (quantityValue) quantityValue.textContent = quantity.toString();
    });

    sizeSelect?.addEventListener("change", () => {
      // preserve selected value in the options object when adding to cart
    });

    colorSelect?.addEventListener("change", () => {
      // preserve selected value in the options object when adding to cart
    });

    categorySelect?.addEventListener("change", () => {
      // preserve selected value in the options object when adding to cart
    });
}

function generateStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let starsHTML = '';


  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline; margin-right: 2px;">
      <path d="M4.82551 0.56411C4.9074 0.395039 5.03525 0.252452 5.19442 0.152684C5.3536 0.0529152 5.53765 0 5.72551 0C5.91337 0 6.09743 0.0529152 6.2566 0.152684C6.41577 0.252452 6.54363 0.395039 6.62551 0.56411L7.58751 2.56411C7.66014 2.71508 7.76953 2.84539 7.90565 2.94306C8.04176 3.04074 8.20023 3.10265 8.36651 3.12311L10.5665 3.39311C10.7562 3.41633 10.9354 3.49343 11.0826 3.6153C11.2299 3.73717 11.3391 3.89869 11.3974 4.08073C11.4557 4.26277 11.4606 4.45771 11.4115 4.64245C11.3625 4.82719 11.2615 4.994 11.1205 5.12311L9.53751 6.57611C9.41106 6.69189 9.3165 6.83824 9.26291 7.0011C9.20933 7.16396 9.19851 7.33786 9.23151 7.50611L9.64551 9.61711C9.68217 9.80305 9.66523 9.99559 9.59667 10.1723C9.52811 10.349 9.41075 10.5025 9.25827 10.6151C9.10579 10.7276 8.92447 10.7945 8.73542 10.808C8.54638 10.8215 8.3574 10.7809 8.19051 10.6911L6.19951 9.62111C6.05395 9.54286 5.89127 9.5019 5.72601 9.5019C5.56075 9.5019 5.39807 9.54286 5.25251 9.62111L3.26051 10.6911C3.09362 10.7809 2.90464 10.8215 2.7156 10.808C2.52656 10.7945 2.34523 10.7276 2.19275 10.6151C2.04027 10.5025 1.92291 10.349 1.85435 10.1723C1.78579 9.99559 1.76886 9.80305 1.80551 9.61711L2.21951 7.50611C2.25251 7.33786 2.2417 7.16396 2.18811 7.0011C2.13452 6.83824 2.03996 6.69189 1.91351 6.57611L0.325511 5.12211C0.184246 4.99305 0.0829729 4.82617 0.0337104 4.64128C-0.0155521 4.45639 -0.0107356 4.26125 0.0475886 4.07901C0.105913 3.89677 0.215296 3.73509 0.362756 3.61316C0.510216 3.49123 0.689563 3.41416 0.879511 3.39111L3.07951 3.12111C3.24579 3.10065 3.40426 3.03874 3.54038 2.94106C3.67649 2.84339 3.78588 2.71308 3.85851 2.56211L4.82551 0.56411Z" fill="#F5B423"/>
    </svg>`;
  }

  // Half star
  if (hasHalfStar) {
    starsHTML += `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline; margin-right: 2px;position: relative;">
      <defs>
        <linearGradient id="halfFill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" style="stop-color:#F5B423;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#e0e0e0;stop-opacity:1" />
        </linearGradient> 
      </defs>
      <path d="M4.82551 0.56411C4.9074 0.395039 5.03525 0.252452 5.19442 0.152684C5.3536 0.0529152 5.53765 0 5.72551 0C5.91337 0 6.09743 0.0529152 6.2566 0.152684C6.41577 0.252452 6.54363 0.395039 6.62551 0.56411L7.58751 2.56411C7.66014 2.71508 7.76953 2.84539 7.90565 2.94306C8.04176 3.04074 8.20023 3.10265 8.36651 3.12311L10.5665 3.39311C10.7562 3.41633 10.9354 3.49343 11.0826 3.6153C11.2299 3.73717 11.3391 3.89869 11.3974 4.08073C11.4557 4.26277 11.4606 4.45771 11.4115 4.64245C11.3625 4.82719 11.2615 4.994 11.1205 5.12311L9.53751 6.57611C9.41106 6.69189 9.3165 6.83824 9.26291 7.0011C9.20933 7.16396 9.19851 7.33786 9.23151 7.50611L9.64551 9.61711C9.68217 9.80305 9.66523 9.99559 9.59667 10.1723C9.52811 10.349 9.41075 10.5025 9.25827 10.6151C9.10579 10.7276 8.92447 10.7945 8.73542 10.808C8.54638 10.8215 8.3574 10.7809 8.19051 10.6911L6.19951 9.62111C6.05395 9.54286 5.89127 9.5019 5.72601 9.5019C5.56075 9.5019 5.39807 9.54286 5.25251 9.62111L3.26051 10.6911C3.09362 10.7809 2.90464 10.8215 2.7156 10.808C2.52656 10.7945 2.34523 10.7276 2.19275 10.6151C2.04027 10.5025 1.92291 10.349 1.85435 10.1723C1.78579 9.99559 1.76886 9.80305 1.80551 9.61711L2.21951 7.50611C2.25251 7.33786 2.2417 7.16396 2.18811 7.0011C2.13452 6.83824 2.03996 6.69189 1.91351 6.57611L0.325511 5.12211C0.184246 4.99305 0.0829729 4.82617 0.0337104 4.64128C-0.0155521 4.45639 -0.0107356 4.26125 0.0475886 4.07901C0.105913 3.89677 0.215296 3.73509 0.362756 3.61316C0.510216 3.49123 0.689563 3.41416 0.879511 3.39111L3.07951 3.12111C3.24579 3.10065 3.40426 3.03874 3.54038 2.94106C3.67649 2.84339 3.78588 2.71308 3.85851 2.56211L4.82551 0.56411Z" fill="url(#halfFill)"/>
    </svg>`;
  }

  // Empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline; margin-right: 2px;">
      <path d="M4.82551 0.56411C4.9074 0.395039 5.03525 0.252452 5.19442 0.152684C5.3536 0.0529152 5.53765 0 5.72551 0C5.91337 0 6.09743 0.0529152 6.2566 0.152684C6.41577 0.252452 6.54363 0.395039 6.62551 0.56411L7.58751 2.56411C7.66014 2.71508 7.76953 2.84539 7.90565 2.94306C8.04176 3.04074 8.20023 3.10265 8.36651 3.12311L10.5665 3.39311C10.7562 3.41633 10.9354 3.49343 11.0826 3.6153C11.2299 3.73717 11.3391 3.89869 11.3974 4.08073C11.4557 4.26277 11.4606 4.45771 11.4115 4.64245C11.3625 4.82719 11.2615 4.994 11.1205 5.12311L9.53751 6.57611C9.41106 6.69189 9.3165 6.83824 9.26291 7.0011C9.20933 7.16396 9.19851 7.33786 9.23151 7.50611L9.64551 9.61711C9.68217 9.80305 9.66523 9.99559 9.59667 10.1723C9.52811 10.349 9.41075 10.5025 9.25827 10.6151C9.10579 10.7276 8.92447 10.7945 8.73542 10.808C8.54638 10.8215 8.3574 10.7809 8.19051 10.6911L6.19951 9.62111C6.05395 9.54286 5.89127 9.5019 5.72601 9.5019C5.56075 9.5019 5.39807 9.54286 5.25251 9.62111L3.26051 10.6911C3.09362 10.7809 2.90464 10.8215 2.7156 10.808C2.52656 10.7945 2.34523 10.7276 2.19275 10.6151C2.04027 10.5025 1.92291 10.349 1.85435 10.1723C1.78579 9.99559 1.76886 9.80305 1.80551 9.61711L2.21951 7.50611C2.25251 7.33786 2.2417 7.16396 2.18811 7.0011C2.13452 6.83824 2.03996 6.69189 1.91351 6.57611L0.325511 5.12211C0.184246 4.99305 0.0829729 4.82617 0.0337104 4.64128C-0.0155521 4.45639 -0.0107356 4.26125 0.0475886 4.07901C0.105913 3.89677 0.215296 3.73509 0.362756 3.61316C0.510216 3.49123 0.689563 3.41416 0.879511 3.39111L3.07951 3.12111C3.24579 3.10065 3.40426 3.03874 3.54038 2.94106C3.67649 2.84339 3.78588 2.71308 3.85851 2.56211L4.82551 0.56411Z" fill="#e0e0e0"/>
    </svg>`;
  }

  return starsHTML;
}

function generateYouMayAlsoLike() {
    const youMayAlsoLike = document.getElementById('you-may-also-like-content') as HTMLDivElement;
    const shuffledItems = [...items].sort(() => 0.5 - Math.random());
    const randomItems = shuffledItems.slice(0, 4);

    randomItems.forEach(item => {
        const productCard = document.createElement('div')
        productCard.classList.add('product-card')
        productCard.classList.toggle("sale", item.salesStatus);
        productCard.innerHTML = `
            <span class="sale">SALE</span>
            <img
              src="${item.imageUrl}"
              alt="${item.name}" />
            <h4>${item.name}</h4>
            <h4>$${item.price.toFixed(2)}</h4>
            <button class="btn">Add To Cart</button>
        `

        youMayAlsoLike.appendChild(productCard)
    })

}