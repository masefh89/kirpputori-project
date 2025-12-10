async function loadListings() {
  const res = await fetch("http://localhost:3001/listings");
  const listings = await res.json();

  console.log(listings);       // See the data
}

window.onload = loadListings;