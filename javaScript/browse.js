// browse.js
// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get container for the items - selects the main container element from the page
    const container = document.querySelector("main .container");

    // Create a row to hold all item cards - creates a new div element for the grid row
    const itemsContainer = document.createElement("div");
    // Add Bootstrap classes for row layout and spacing between items
    itemsContainer.classList.add("row", "g-3");
    // Append the new row container to the main container
    container.appendChild(itemsContainer);

    // Get search/filter elements - select all filter controls from the page
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const viewType = document.getElementById("viewType");
    const applyFiltersBtn = document.getElementById("applyFiltersBtn");

    // Array to store all items from backend - initialize empty array for storing fetched items
    let allItems = [];

    
    // Fetch items from backend
    
    async function fetchItems() {
        try {
            // Make HTTP GET request to the backend API endpoint
            const response = await fetch("http://localhost:3001/listings");
            // Check if response was successful, throw error if not
            if (!response.ok) throw new Error("Failed to fetch items from server");
            // Parse JSON response and store in allItems array
            allItems = await response.json();
            // Display the fetched items on the page
            displayItems(allItems);
        } catch (error) {
            // Log any errors to console
            console.error("Error fetching items:", error);
            // Display error message to user
            itemsContainer.innerHTML = "<p class='text-danger'>Failed to load items</p>";
        }
    }

    // Display items as cards
    
    function displayItems(items) {
        // Clear any existing items in the container
        itemsContainer.innerHTML = "";
        // Check if items array is empty
        if (items.length === 0) {
            // Display "no items" message
            itemsContainer.innerHTML = "<p class='text-muted'>No items found.</p>";
            // Exit function early since there are no items to display
            return;
        }
        // Loop through each item in the array
        items.forEach(item => {
            // Create a column div for each item card
            const col = document.createElement("div");
            // Set column width based on view type (list view or grid view)
            col.className = viewType.value === "list" ? "col-12" : "col-md-4";

            // Create the card element
            const card = document.createElement("div");
            // Add Bootstrap card styling classes
            card.className = "card shadow-sm items-card";

            // Set the HTML content of the card using template literal
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
            // Add the card to the column
            col.appendChild(card);

            // Add the column to the main items container
            itemsContainer.appendChild(col);
        });
        // Set up click handlers for favorite buttons
        setupFavoriteButtons();
    }

    //Apply search and filters
    function applyFilters() {
        // Create a copy of all items to work with (prevents modifying original array)
        let filtered = [...allItems];
        // Filter by category if not "all"
        if (categoryFilter.value !== "all") {
            filtered = filtered.filter(item =>
                item.category.toLowerCase() === categoryFilter.value.toLowerCase()
            );
        }

        // Sort by price if a price filter is selected
        if (priceFilter.value === "low-high") filtered.sort((a, b) => a.price - b.price);
        else if (priceFilter.value === "high-low") filtered.sort((a, b) => b.price - a.price);
        // Apply search filter if search term exists
        const term = searchInput.value.trim().toLowerCase();
        if (term) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(term) ||
                item.briefDescription.toLowerCase().includes(term)
            );
        }
        // Display the filtered results
        displayItems(filtered);
    }

    // Favorite button click handler
    function setupFavoriteButtons() {
        // Select all favorite buttons on the page
        const favButtons = document.querySelectorAll(".favorite-btn");
        // Add click event listener to each button
        favButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                // Get the item ID from the button's data attribute
                const id = btn.getAttribute("data-id");
                // Show alert (temporary - would be replaced with actual favorite functionality)
                alert(`Added to favorites: ${id}`);
            });
        });
    }

    // Event listeners for search and filter controls

    // Add click listener to search button
    searchBtn.addEventListener("click", applyFilters);

    // Add click listener to apply filters button
    applyFiltersBtn.addEventListener("click", applyFilters);

    // Add change listener to view type selector (grid/list)
    viewType.addEventListener("change", applyFilters);

    // Fetch items when page loads
    fetchItems();
});
