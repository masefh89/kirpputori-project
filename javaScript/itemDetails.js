//get the listing id from the url
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

//store id of html elements
const title = document.getElementById("title");
const briefDescription = document.getElementById("briefDescription");
const description = document.getElementById("description");
const price = document.getElementById("price");
const category = document.getElementById("category");
const type = document.getElementById("type");
const sellerLocation = document.getElementById("location");
const date = document.getElementById("date");
const image = document.getElementById("image");
const sellerName = document.getElementById("sellerName");


async function getListings() {
    try {
        //get data
        const response = await fetch(`http://localhost:3001/listings/${id}`);

        //store the data of the listing
        const listing = await response.json();
        
        //fill the data to the page
         
        title.innerText = listing.title;
        briefDescription.innerText = listing.briefDescription;
        description.innerText = listing.description;
        price.innerText = listing.price;
        category.innerText = listing.category;
        type.innerText = listing.type;
        sellerLocation.innerText = listing.location;
        date.innerText = listing.date;
        image.src = "../images/" + listing.image;
        sellerName.innerText = listing.sellerName;
    }catch (err) {
        console.error("Error fetching listings:", err);
    }
}

window.onload = getListings;