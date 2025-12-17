// browse.js
// Simple, beginner-friendly dynamic loading of items

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("main .container");
    const itemsContainer = document.createElement("div");
    itemsContainer.classList.add("row", "g-3");
    container.appendChild(itemsContainer);

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const viewType = document.getElementById("viewType");
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");

    let allItems = [];

    // Fetch items from backend
    async function fetchItems() {
        try {
            const res = await fetch("http://localhost:3001/listings");
            allItems = await res.json();
            displayItems(allItems);
        } catch (err) {
            console.error("Error fetching items:", err);
        }
    }

    // Create and show cards
    function displayItems(items) {
        itemsContainer.innerHTML = "";
        items.forEach(item => {
            const col = document.createElement("div");
            col.className = viewType.value === "list" ? "col-12" : "col-md-4";

            const card = document.createElement("div");
            card.className = "card h-100";

            card.innerHTML = `
                <img src="${item.image}" class="card-img-top" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-subtitle mb-2 text-muted">Seller: ${item.seller || "Unknown"}</p>
                    <p class="card-text">Price: $${item.price}</p>
                    <p class="card-text">${item.briefDescription}</p>
                    <button class="btn btn-primary me-2">View Details</button>
                    <button class="btn btn-warning">★</button>
                </div>
            `;

            // Add click events
            card.querySelector(".btn-primary").addEventListener("click", () => {
                alert("View Details clicked for " + item.title);
            });
            card.querySelector(".btn-warning").addEventListener("click", () => {
                alert("Added to favorites: " + item.title);
            });

            col.appendChild(card);
            itemsContainer.appendChild(col);
        });
    }

    // Apply search and filters
    function applyFilters() {
        let filtered = [...allItems];

        if (categoryFilter.value !== "all") {
            filtered = filtered.filter(i => i.category.toLowerCase() === categoryFilter.value.toLowerCase());
        }

        if (priceFilter.value === "low-high") filtered.sort((a, b) => a.price - b.price);
        else if (priceFilter.value === "high-low") filtered.sort((a, b) => b.price - a.price);

        const term = searchInput.value.trim().toLowerCase();
        if (term) {
            filtered = filtered.filter(i =>
                i.title.toLowerCase().includes(term) ||
                i.briefDescription.toLowerCase().includes(term)
            );
        }

        displayItems(filtered);
    }

    searchBtn.addEventListener("click", applyFilters);
    applyFiltersBtn.addEventListener("click", applyFilters);
    viewType.addEventListener("change", applyFilters);

    fetchItems();
});
