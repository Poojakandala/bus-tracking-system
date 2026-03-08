import { db } from "./firebase.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.startBus = async function() {
    // 1. Capture user input
    const dIdInput = document.getElementById("driverid").value.trim();
    const bNoInput = document.getElementById("busno").value.trim();

    if (!dIdInput || !bNoInput) {
        alert("Please enter both Driver ID and Bus Number.");
        return;
    }

    try {
        // 2. Authenticate the Driver first
        const driverRef = ref(db, 'drivers/' + dIdInput);
        const snapshot = await get(driverRef);

        if (!snapshot.exists()) {
            alert("Invalid Driver ID. Please register before driving.");
            return;
        }

        // 3. Start Geolocation Tracking
        if (navigator.geolocation) {
            alert(`Tracking Started! You are now driving Bus ${bNoInput}`);

            navigator.geolocation.watchPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // 4. Update the specific bus the driver chose
                // This allows any driver to update any bus node
                update(ref(db, 'buses/bus' + bNoInput), {
                    dId: parseInt(dIdInput), // Store who is driving
                    latitude: lat,
                    longitude: lon,
                    lastUpdated: new Date().toLocaleTimeString()
                });

            }, (err) => {
                alert("GPS Error: Please enable location on your phone.");
            }, { enableHighAccuracy: true });
            
        } else {
            alert("Browser does not support GPS.");
        }
    } catch (error) {
        console.error("Login Error:", error);
    }
};
