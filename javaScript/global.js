// global.js
// Wait until the entire page is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get the container where item cards will be displayed
    const row = document.getElementById("recentItemsRow");
    if (!row) return; // Exit if container not found

    // -----------------------------
    // Fetch recent items from backend
    // -----------------------------
    async function loadRecentlyAdded() {
        try {
            // Fetch the latest 6 listings from server
            const response = await fetch("http://localhost:3001/listings/recent");

            // Check if server returned OK
            if (!response.ok) throw new Error("Network response not OK");

            // Parse JSON response
            const items = await response.json();

            // Check if there are any items
            if (items.length === 0) {
                row.innerHTML = "<p class='text-muted'>No recent items available.</p>";
                return;
            }

            // Display each item as a card
            row.innerHTML = items.map(item => generateCardHTML(item)).join("");

            // After cards are created, add favorite button functionality
            setupFavoriteButtons();

        } catch (error) {
            // Handle errors
            console.error("Failed to load recent items:", error);
            row.innerHTML = "<p class='text-danger'>Failed to load items</p>";
        }
    }

    // -----------------------------
    // Function to generate HTML for one item card
    // -----------------------------
    function generateCardHTML(item) {
        return `
            <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div class="card shadow-sm items-card">
                <div class="position-relative">
                  <!-- Item image -->
                  <img src="/images/${item.image}" class="card-img-top" alt="${item.title}">
                  <!-- Favorite button -->
                  <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 p-2 rounded-circle shadow-sm favorite-btn" 
                          data-id="${item.id}" 
                          title="Add to favorites">
                    <i class="fa-regular fa-heart"></i>
                  </button>
                </div>
                <div class="card-body d-flex flex-column justify-content-between">
                  <!-- Item title -->
                  <h5 class="card-title">${item.title}</h5>
                  <!-- Seller name -->
                  <p class="card-subtitle mb-2 text-muted">Seller: ${item.seller || "Unknown"}</p>
                  <!-- Category -->
                  <p class="card-text text-muted">Category: ${item.category || "N/A"}</p>
                  <!-- Price -->
                  <p class="card-text fw-bold mb-2">
                    <i class="fa-solid fa-euro-sign"></i> ${parseFloat(item.price).toFixed(2)}
                  </p>
                  <!-- Description -->
                  <p class="card-text mb-2">${item.briefDescription || "No description"}</p>
                  <!-- View details button -->
                  <a href="./pages/item-details.html?id=${item.id}" class="btn btn-primary w-100 mt-2">
                    <i class="fa-solid fa-eye"></i> View Details
                  </a>
                </div>
              </div>
            </div>
        `;
    }

    // -----------------------------
    // Function to handle favorite button click
    // -----------------------------
    function setupFavoriteButtons() {
        const favButtons = document.querySelectorAll(".favorite-btn");
        favButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                alert(`Added to favorites: ${id}`);
                // Here you could add code to save favorites in localStorage or backend
            });
        });
    }

    // Call the function to load items when page loads
    loadRecentlyAdded();
});
