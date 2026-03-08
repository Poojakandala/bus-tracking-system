import { db } from "./firebase.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.signupDriver = function() {
    const id = document.getElementById("driverId").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    if (!id || !name || !phone) {
        alert("Please fill in all fields");
        return;
    }

    // Saving to 'drivers' node so the map can find them later
    set(ref(db, 'drivers/' + id), {
        name: name,
        phone: phone,
        registeredAt: Date.now()
    })
    .then(() => {
        alert("Driver Registered Successfully!");
        // Optional: Redirect to login page
        // window.location.href = "driver-login.html";
    })
    .catch((error) => {
        console.error("Signup Error:", error);
        alert("Error: " + error.message);
    });
};
