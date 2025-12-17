

const defaultBtn = document.getElementById('defaultImageBtn');

//behavior for default image button
if (defaultBtn) {
  defaultBtn.addEventListener('click', () => {
    // Set hidden input value to true
    document.getElementById('useDefaultImage').value = "true";

    // Clear file input in case user had selected a file
    const fileInput = document.getElementById('imageInput');
    fileInput.value = "";

    // Remove validation error if it was showing
    fileInput.classList.remove('is-invalid');

    alert("Default image selected"); // optional feedback
  });
}

function checkForm() {
  'use strict';
  //get user to check if logged in
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("Please log in to sell an item");
    return;
  }
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();  // ALWAYS prevent default — we’ll handle submission manually

      // If form is invalid, stop here
      if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      form.classList.add('was-validated');

      const useDefault = document.getElementById('useDefaultImage').value === "true";
        let imageData = "";

        if (useDefault) {
            imageData = "default.png"; // or a URL to your default image
        } else {
            const fileInput = document.getElementById('imageInput');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            imageData = await toBase64(file); // convert to Base64
        } else {
            // fallback in case user didn't pick image
            alert("Please select an image or use default");
            return;
        }
    }

      const id = crypto.randomUUID();
      const seller = JSON.parse(localStorage.getItem("loggedInUser"));
      const sellerId = seller?.id;
      const sellerName = seller?.name;
      //  COLLECT FORM DATA
      const formData = {
        id: id,
        title: form.querySelector("[name='title']").value,
        briefDescription: form.querySelector("[name='briefDescription']").value,
        description: form.querySelector("[name='description']").value,
        price: form.querySelector("[name='price']").value,
        category: form.querySelector("[name='category']").value,
        type: form.querySelector("[name='type']").value,
        location: form.querySelector("[name='location']").value,
        image: imageData,
        sellerName: sellerName,
        sellerId: sellerId
      };
      
      try {
        //  SEND TO SERVER 
        const response = await fetch("http://localhost:3001/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          alert("Listing created successfully!");
          form.reset();
          form.classList.remove("was-validated");
        } else {
          alert("Error creating listing");
        }

      } catch (err) {
        console.error("Error sending form data:", err);
        alert("Server error");
      }

    }, false);
  });
}

window.onload = checkForm;

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}