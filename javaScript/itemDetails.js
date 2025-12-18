const params = new URLSearchParams(window.location.search);

  
const id = params.get("id");

console.log(id);


async function getListings() {
    try {
        //get data
        const response = await fetch(`http://localhost:3001/listings/${id}`);

        const listing = await response.json();
        

    }catch (err) {
        console.error("Error fetching listings:", err);
    }
}

window.onload = getListings;