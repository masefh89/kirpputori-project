// browse.js
// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get container for the items
    const container = document.querySelector("main .container");

    // Create a row to hold all item cards
    const itemsContainer = document.createElement("div");
    itemsContainer.classList.add("row", "g-3");
    container.appendChild(itemsContainer);

    // Get search/filter elements
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const viewType = document.getElementById("viewType");
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");

    // Array to store all items from backend
    let allItems = [];

    // -----------------------------
    // Fetch items from backend
    // -----------------------------
    async function fetchItems() {
        try {
            const response = await fetch("http://localhost:3001/listings");
            if (!response.ok) throw new Error("Failed to fetch items from server");

            allItems = await response.json();
            displayItems(allItems);
        } catch (error) {
            console.error("Error fetching items:", error);
            itemsContainer.innerHTML = "<p class='text-danger'>Failed to load items</p>";
        }
    }

    // -----------------------------
    // Display items as cards
    // -----------------------------
    function displayItems(items) {
        itemsContainer.innerHTML = "";

        if (items.length === 0) {
            itemsContainer.innerHTML = "<p class='text-muted'>No items found.</p>";
            return;
        }

        items.forEach(item => {
            const col = document.createElement("div");
            col.className = viewType.value === "list" ? "col-12" : "col-md-4";

            const card = document.createElement("div");
            card.className = "card shadow-sm items-card";

            card.innerHTML = `
                <div class="position-relative">
                  <img src="/images/${item.image}" class="card-img-top" alt="${item.title}">
                  <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 p-2 rounded-circle shadow-sm favorite-btn" 
                          data-id="${item.id}" title="Add to favorites">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <div class="card-body d-flex flex-column justify-content-between">
                  <h5 class="card-title">${item.title}</h5>
                  <p class="card-subtitle mb-2 text-muted">Seller: ${item.seller || "Unknown"}</p>
                  <p class="card-text text-muted">Category: ${item.category || "N/A"}</p>
                  <p class="card-text fw-bold mb-2">€${parseFloat(item.price).toFixed(2)}</p>
                  <p class="card-text mb-2">${item.briefDescription || "No description"}</p>
                  <a href="./item-details.html?id=${item.id}" class="btn btn-primary w-100 mt-2">
                    <i class="fa-solid fa-eye"></i> View Details
                  </a>
                </div>
            `;

            col.appendChild(card);
            itemsContainer.appendChild(col);
        });

        setupFavoriteButtons();
    }

    // -----------------------------
    // Apply search and filters
    // -----------------------------
    function applyFilters() {
        let filtered = [...allItems];

        if (categoryFilter.value !== "all") {
            filtered = filtered.filter(item =>
                item.category.toLowerCase() === categoryFilter.value.toLowerCase()
            );
        }

        if (priceFilter.value === "low-high") filtered.sort((a, b) => a.price - b.price);
        else if (priceFilter.value === "high-low") filtered.sort((a, b) => b.price - a.price);

        const term = searchInput.value.trim().toLowerCase();
        if (term) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(term) ||
                item.briefDescription.toLowerCase().includes(term)
            );
        }

        displayItems(filtered);
    }

    // -----------------------------
    // Favorite button click handler
    // -----------------------------
    function setupFavoriteButtons() {
        const favButtons = document.querySelectorAll(".favorite-btn");
        favButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                alert(`Added to favorites: ${id}`);
            });
        });
    }

    // -----------------------------
    // Event listeners
    // -----------------------------
    searchBtn.addEventListener("click", applyFilters);
    applyFiltersBtn.addEventListener("click", applyFilters);
    viewType.addEventListener("change", applyFilters);

    // Fetch items when page loads
    fetchItems();
});
