import { db } from "./firebase.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// This makes the function visible to your HTML button
window.startBus = async function() {
    console.log("Button clicked!"); // Check your phone's console for this

    const dIdInput = document.getElementById("driverid").value.trim();
    const bNoInput = document.getElementById("busno").value.trim();

    if (!dIdInput || !bNoInput) {
        alert("Enter Driver ID and Bus Number");
        return;
    }

    try {
        // 1. Check if driver exists
        const driverRef = ref(db, 'drivers/' + dIdInput);
        const snapshot = await get(driverRef);

        if (!snapshot.exists()) {
            alert("Driver ID " + dIdInput + " not found in database!");
            return;
        }

        const driverData = snapshot.val();
        const driverPhone = driverData.phone; //

        // 2. Request Location
        if (navigator.geolocation) {
            alert("GPS Initializing... Please click 'Allow' if prompted.");

            navigator.geolocation.watchPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // 3. Update the 'buses' node
                // We use 'bus' + bNoInput to match your 'bus1' key
                update(ref(db, 'buses/bus' + bNoInput), {
                    dId: parseInt(dIdInput), // Store as integer
                    latitude: lat,           //
                    longitude: lon,          //
                    phone: driverPhone       // Added for students
                }).then(() => {
                    console.log("Location updated successfully!");
                });

            }, (error) => {
                alert("GPS Error: " + error.message);
            }, { 
                enableHighAccuracy: true,
                maximumAge: 0 
            });
        } else {
            alert("Your browser does not support GPS.");
        }
    } catch (err) {
        alert("Firebase Error: " + err.message);
    }
};
