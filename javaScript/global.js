// Wait until the entire HTML page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("Page loaded successfully");
});

/*
  This function shows a simple message to the user that shows the status of the login page
  message: the text that will be shown in an alert box
*/
function showMessage(message) {
    alert(message);
};

function generateCardHTML(item) {
  return `
    <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
      <div class="card shadow-sm items-card">
        <div class="position-relative">
          <img src="./images/${item.image}" class="card-img-top" alt="${item.title}">
          <!-- Favorite button -->
          <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 p-2 rounded-circle shadow-sm favorite-btn" 
                  data-id="${item.id}" 
                  title="Add to favorites">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-subtitle mb-2 text-muted">Seller: ${item.seller || "Unknown"}</p>
          <p class="card-text fw-bold mb-2">
            <i class="fa-solid fa-euro-sign"></i> ${parseFloat(item.price).toFixed(2)}
          </p>
          <a href="./pages/item-details.html?id=${item.id}" class="btn btn-primary w-100 mt-2">
            <i class="fa-solid fa-eye"></i> View Details
          </a>
        </div>
      </div>
    </div>
  `;
}


// Function to load recently added items
function loadRecentlyAdded() {
  const row = document.getElementById("recentItemsRow");
  if (!row) return;

  fetch("http://localhost:3001/listings/recent")
    .then(res => {
      if (!res.ok) throw new Error("Network response not ok");
      return res.json();
    })
    .then(items => {
      if (items.length === 0) {
        row.innerHTML = "<p class='text-muted'>No recent items available.</p>";
        return;
      }
      row.innerHTML = items.map(generateCardHTML).join("");
    })
    .catch(err => {
      console.error("Failed to load recent items", err);
      row.innerHTML = "<p class='text-danger'>Failed to load items</p>";
    });
}

