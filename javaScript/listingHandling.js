//checking if the user is logged in
function checkLogin() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
        return true;
    } else {
        return false;
    }
}

async function getListings() {
    //if logged in, execute
    if(checkLogin()){
        //get user
        const seller = JSON.parse(localStorage.getItem("loggedInUser"))
        const sellerId = seller.id

        //server call and data handling
        try {
        //get data
        const response = await fetch("http://localhost:3001/listings");

        const listings = await response.json();

        const container = document.getElementById("listingsContainer");
        
        //loop trough listings, show the ones wich belong to the logged in user
        listings.forEach(listing => {
            if(listing.sellerId === sellerId){ 
                const col = document.createElement("div");
                col.className = "col-md-4 mb-4"; // 3 per row on medium+ screens
                //card that displays the listing
                col.innerHTML = `
                    <div class="card h-100">
                    <img src="../images/${listing.image}" class="card-img-top" alt="${listing.title}">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title mb-0">${listing.title}</h5>
                            <p class="card-text mb-0"><strong>Price:</strong> ${listing.price}</p>
                        </div>
                        <p class="card-text">${listing.briefDescription}</p>
                        <p class="card-text"><strong>Type:</strong> ${listing.type}</p>
                        <p class="card-text"><strong>Category:</strong> ${listing.category}</p>
                        <p class="card-text"><strong>Location:</strong> ${listing.location}</p>
                        <p class="card-text"><strong>Date published:</strong> ${listing.date}</p>
                        <p class="card-text"><strong>Seller:</strong> ${listing.sellerName}</p>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <button class="btn btn-warning edit-button" data-id="${listing.id}">Edit</button>
                            <button class="btn btn-danger delete-button" data-id="${listing.id}">Delete</button>
                        </div>
                    </div>
                    </div>
                `;
                //add the card to the container
                container.appendChild(col);


                //delete button functionality
                const deleteBtn = col.querySelector(".delete-button");

                //add event listener to the delete button
                deleteBtn.addEventListener("click", async () => {
                const confirmDelete = confirm("Are you sure you want to delete this listing?");
                if (!confirmDelete) return;
                
                //server call to delete listing
                try {
                    const listingId = deleteBtn.getAttribute("data-id");

                    // Call backend to delete
                    const response = await fetch(`http://localhost:3001/listings/${listingId}`, {
                    method: "DELETE"
                    });

                    const result = await response.json();

                    if (result.success) {
                    // Remove card from DOM
                    col.remove();
                    alert("Listing deleted successfully!");
                    } else {
                    alert("Failed to delete listing");
                    }

                } catch (err) {
                    console.error("Error deleting listing:", err);
                    alert("Server error");
                }
                });

                //edit button functionality
                const editFormContainer = document.createElement("div");
                editFormContainer.className = "edit-form-container mt-2";
                editFormContainer.style.display = "none";

                //edit form that will be displayed when the edit button is clicked
                editFormContainer.innerHTML = `
                <form>
                    <div class="mb-2">
                        <label>Title</label>
                        <input type="text" class="form-control form-title">
                    </div>
                    <div class="mb-2">
                        <label>Brief Description</label>
                        <input type="text" class="form-control form-briefDescription">
                    </div>
                    <div class="mb-2">
                        <label>Description</label>
                        <textarea class="form-control form-description"></textarea>
                    </div>
                    <div class="mb-2">
                        <label>Price</label>
                        <input type="text" class="form-control form-price">
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Category</label>
                        <select class="form-control form-category">
                        <option value="" selected disabled>Select a category</option>
                        <option>Art</option>
                        <option>Vehicles and Parts</option>
                        <option>Electronics</option>
                        <option>Animals and Pets</option>
                        <option>Furniture</option>
                        <option>Garden and Building</option>
                        <option>Sports and Outdoors</option>
                        <option>Clothes</option>
                        <option>Hobbies</option>
                        </select>
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Type</label>
                        <select class="form-control form-type">
                        <option value="" selected disabled>Select a category</option>
                        <option>Selling</option>
                        <option>Buying</option>
                        <option>Giving Away</option>
                        </select>
                    </div>
                    <div class="mb-2">
                        <label>Location</label>
                        <input type="text" class="form-control form-location">
                    </div>
                    <button type="submit" class="btn btn-success save-button">Save</button>
                    <button type="button" class="btn btn-secondary cancel-button">Cancel</button>
                </form>
                `;

                col.querySelector(".card-body").appendChild(editFormContainer);
                
                //get editbutton and add eventlistener
                const editBtn = col.querySelector(".edit-button");
                editBtn.addEventListener("click", () => {

                    // Toggle edit form visibility
                    editFormContainer.style.display = editFormContainer.style.display === "none" ? "block" : "none";

                    // add existing listing data to the form
                    editFormContainer.querySelector(".form-title").value = listing.title;
                    editFormContainer.querySelector(".form-briefDescription").value = listing.briefDescription;
                    editFormContainer.querySelector(".form-description").value = listing.description;
                    editFormContainer.querySelector(".form-price").value = listing.price;
                    editFormContainer.querySelector(".form-category").value = listing.category;
                    editFormContainer.querySelector(".form-type").value = listing.type;
                    editFormContainer.querySelector(".form-location").value = listing.location;
                });
                //create save and cancel buttons
                const saveBtn = editFormContainer.querySelector(".save-button");
                const cancelBtn = editFormContainer.querySelector(".cancel-button");

                cancelBtn.addEventListener("click", () => {
                    editFormContainer.style.display = "none";
                });
                //add eventlistener to the save button
                saveBtn.addEventListener("click", async (e) => {
                    e.preventDefault();

                    //updated listing values
                    const updatedListing = {
                        title: editFormContainer.querySelector(".form-title").value,
                        briefDescription: editFormContainer.querySelector(".form-briefDescription").value,
                        description: editFormContainer.querySelector(".form-description").value,
                        price: editFormContainer.querySelector(".form-price").value,
                        category: editFormContainer.querySelector(".form-category").value,
                        type: editFormContainer.querySelector(".form-type").value,
                        location: editFormContainer.querySelector(".form-location").value,
                    };

                    //server call to edit
                    try {
                        const response = await fetch(`http://localhost:3001/listings/${listing.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updatedListing)
                        });
                        
                        const result = await response.json();
                        

                        if (result.success) {
                            // Update card immediately
                            listing.title = updatedListing.title;
                            listing.briefDescription = updatedListing.briefDescription;
                            listing.description = updatedListing.description;
                            listing.price = updatedListing.price;
                            listing.category = updatedListing.category;
                            listing.type = updatedListing.type;
                            listing.location = updatedListing.location;

                            getListings(); // Refresh cards
                            alert("Listing updated successfully!");
                        } else alert("Failed to update listing");
                    } catch (err) {
                        console.error("Error updating listing:", err);
                        alert("Server error");
                    }
                });
        }});

        } catch (err) {
        console.error("Error fetching listings:", err);
        }

    }
    else{
        window.location.href = "/pages/login.html";
    }
}

window.onload = getListings;