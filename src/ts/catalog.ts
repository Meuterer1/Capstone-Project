export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: Category;
  color: Color;
  size: Size;
  salesStatus: boolean;
  rating: number;
  popularity: number;
  blocks: string[];
};

export type Category =
  | "carry-ons"
  | "suitcases"
  | "luggage sets"
  | "kids' luggage";

export type Color =
  | "red"
  | "blue"
  | "green"
  | "black"
  | "grey"
  | "yellow"
  | "pink";

export type Size =
  | "S"
  | "M"
  | "L"
  | "XL"
  | "S-L"
  | "S, M, XL";

export type SaleStatus = "true" | "false";

export type FilterOptions = {
  category: Category[];
  color: Color[];
  size: Size[];
};

let items: Product[] = [];
let currentPage = 1;
const itemsPerPage = 12;
const sortSelect = document.getElementById("sortingSettings") as HTMLSelectElement | null;
const searchInput = document.getElementById("search-input") as HTMLInputElement | null;
const filterButton = document.getElementById("filter-btn");
const filterOptionsContainer = document.getElementById("filter-options");
const filterForm = document.getElementById("filters");
const clearFiltersButton = document.getElementById("clear-filters-btn");
const hideFiltersButton = document.getElementById("hide-filters-btn");

init();

// Event listeners

 sortSelect?.addEventListener("change", () => {
        const selectedOption = sortSelect.value;
        const [sortBy, order] = selectedOption.split("-");
        const sortedItems = sortData(sortBy as keyof Product, order as "asc" | "desc");

        generateCatalog(sortedItems.slice(0, itemsPerPage));
        generatePagination(sortedItems);
    });

searchInput?.addEventListener("input", () => {
    const searchTerm = searchInput.value;
    const searchResults = searchData(searchTerm);
    if (typeof searchResults === "string") {
        window.alert(searchResults);
    } else if (searchResults.length === 1) {
        window.location.href = `/html/product-details.html?id=${searchResults[0].id}`;
    } else {
        generateCatalog(searchResults.slice(0, itemsPerPage));
        generatePagination(searchResults);
    }
});

filterButton?.addEventListener("mouseenter", () => {
      generateFilterOptions();
}
);

clearFiltersButton?.addEventListener("click", () => {
    const allSelects = filterOptionsContainer?.querySelectorAll("select");
    const salesStatusSelect = filterOptionsContainer?.querySelector("#filterSales") as HTMLInputElement | null;
    
    if (salesStatusSelect) {
        salesStatusSelect.checked = false;
    }
    
    allSelects?.forEach((select) => {
      select.selectedIndex = 0;
    });

    currentPage = 1;
    generateCatalog(items.slice(0, itemsPerPage));
    generatePagination(items);
});

hideFiltersButton?.addEventListener("click", () => {
    filterOptionsContainer?.classList.remove('active');
}); 

filterForm?.addEventListener("change", () => {
  const size = (document.getElementById("filterSize") as HTMLSelectElement).value;
  const color = (document.getElementById("filterColor") as HTMLSelectElement).value;
  const category = (document.getElementById("filterCategory") as HTMLSelectElement).value;
  const salesStatus = (document.getElementById("filterSales") as HTMLInputElement).checked;

  const filteredItems = items.filter((item) => {
    const matchesSize = size === "all" || item.size === size;
    const matchesColor = color === "all" || item.color === color;
    const matchesCategory = category === "all" || item.category === category;
    const matchesSales = !salesStatus || item.salesStatus === true;

    return matchesSize && matchesColor && matchesCategory && matchesSales;
  });

  currentPage = 1;
  generateCatalog(filteredItems.slice(0, itemsPerPage));
  generatePagination(filteredItems);
});

// Functions

function generateCatalog(paginatedItems: Product[] = items) {
  const catalogContainer = document.getElementById("catalog");
  const resultCountContainer = document.getElementById("result-count");

  resultCountContainer!.textContent = `Showing ${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, items.length)} of ${items.length} results`;

    if (catalogContainer) {
        catalogContainer.innerHTML = "";
        paginatedItems.forEach((item) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.classList.toggle("sale", item.salesStatus);
            productCard.innerHTML = `
                <span class="sale">SALE</span>
                <img src="${item.imageUrl}" alt="${item.name}" class="product-image" />
                <h4>${item.name}</h4>
                <h4>$${item.price.toFixed(2)}</h4>
                <button class="btn add-to-cart-btn" data-product-id="${item.id}">Add to Cart</button>
            `;
            catalogContainer.appendChild(productCard);
        }
        );
    }
}

function generateTopSets() {
    const topSetsContainer = document.querySelector(".top-sets");
    if (topSetsContainer) {
            topSetsContainer.innerHTML = '';

            const shuffledItems = [...items].sort(() => 0.5 - Math.random());
            const topSets = shuffledItems.slice(0, 5);

            topSets.forEach((set) => {
                const setCard = document.createElement("div");
                setCard.classList.add("product-card-mini");
                setCard.innerHTML = `
                    <div class='image-wrapper'>
                        <img src="${set.imageUrl}" alt="${set.name}" class="product-image" />
                    </div>
                    <div class='product-info'>
                        <p>${set.name}</p>
                        <div class="rating">${generateStars(set.rating)}</div>
                        <p>$${set.price.toFixed(2)}</p>
                    </div>
                `;
                topSetsContainer.appendChild(setCard);
            }
            );
    }
}

function generatePagination(itemsToPage: Product[] = items) {
    const paginationContainer = document.querySelector(".pagination");
    
    if (paginationContainer) {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(itemsToPage.length / itemsPerPage); 
        
        if (totalPages <= 1) return;
        
        const arrowSvg = `<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="pagination-arrow"><path d="M0.75 0.75L4.75 4.75L0.75 8.75" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        
        // Previous button
        if (currentPage > 1) {
            const prevButton = document.createElement("button");
            prevButton.innerHTML = `${arrowSvg.replace('pagination-arrow', 'pagination-arrow pagination-arrow-left')} Previous`;
            prevButton.classList.add("pagination-btn", "pagination-prev");
            prevButton.addEventListener("click", () => {
                currentPage--;
                const start = (currentPage - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const paginatedItems = itemsToPage.slice(start, end);
                generateCatalog(paginatedItems);
                generatePagination(itemsToPage);
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            });
            paginationContainer.appendChild(prevButton);
        }
        
        // Page number buttons
        const pageButtonsWrapper = document.createElement("div");
        pageButtonsWrapper.classList.add("pagination-page-buttons");
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i.toString();
            pageButton.classList.add("btn", "pagination-page");
            
            if (i === currentPage) {
                pageButton.classList.add("active");
            }
            
            pageButton.addEventListener("click", () => {
                currentPage = i;
                const start = (i - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const paginatedItems = itemsToPage.slice(start, end);
                generateCatalog(paginatedItems);
                generatePagination(itemsToPage);
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            });
            pageButtonsWrapper.appendChild(pageButton);
        }
        paginationContainer.appendChild(pageButtonsWrapper);
        
        // Next button
        if (currentPage < totalPages) {
            const nextButton = document.createElement("button");
            nextButton.innerHTML = `Next ${arrowSvg}`;
            nextButton.classList.add("pagination-btn");
            nextButton.addEventListener("click", () => {
                currentPage++;
                const start = (currentPage - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const paginatedItems = itemsToPage.slice(start, end);
                generateCatalog(paginatedItems);
                generatePagination(itemsToPage);
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            });
            paginationContainer.appendChild(nextButton);
        }
    }
}

function generateFilterOptions() {
  filterOptionsContainer?.classList.add('active')
}

async function init() {
  items = await getData();
  currentPage = 1;
  const firstPageItems = items.slice(0, itemsPerPage);
  generateCatalog(firstPageItems);
  generateTopSets();
  generatePagination(items);
}

async function getData(): Promise<Product[]> {
  const res = await fetch("../assets/data.json");

  if (!res.ok) throw new Error("Błąd ładowania danych");

  const data = await res.json();
  return data.data;
}

function sortData(sortBy: keyof Product, order = "asc") {
    if (!items || items.length === 0) return [];

    if (items) {
        const sortedArray = [...items].sort((a: Product, b: Product) => {
          const valueA = a[sortBy];
          const valueB = b[sortBy];
      
          if (typeof valueA === "string" && typeof valueB === "string") {
            return order === "desc"
              ? valueB.localeCompare(valueA)
              : valueA.localeCompare(valueB);
          } else if (typeof valueA === "number" && typeof valueB === "number") {
                return order === "desc" ? valueB - valueA : valueA - valueB;
            }
            return 0; 
        });
        return sortedArray;
    }
    return []
}

function generateStars(rating: number): string {
  console.log("product.rating:", rating, typeof rating);
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

function searchData(searchTerm: string): Product[] | string {
  const foundItems = [...items].filter((item) =>
    item.name.trim().toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

    if (foundItems.length === 0) {
        window.alert("Product not found");
    }

  return foundItems.length > 0 ? foundItems : "Product not found";
}
