import { db } from "./firebase.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.signupDriver = async function() {
    const dId = document.getElementById("driverId").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    if(!dId || !name || !phone) return alert("Please fill all fields");

    const driverRef = ref(db, 'drivers/' + dId);
    
    try {
        // Step 1: Check if the Driver ID already exists
        const snapshot = await get(driverRef);
        
        if (snapshot.exists()) {
            alert("This Driver ID is already registered! Please use a different ID or login.");
            window.location.href = "driver-login.html";
            return;
        }

        // Step 2: Register new driver
        await set(driverRef, {
            name: name,
            phone: phone,
            status: "active"
        });
        
        alert("Driver Registration Successful!");
        window.location.href = "driver-login.html";

    } catch (error) {
        console.error("Signup Error:", error);
        alert("An error occurred during registration.");
    }
};
