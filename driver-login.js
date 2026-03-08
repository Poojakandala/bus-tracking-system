import { db } from "./firebase.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.startBus = async function() {
    const dIdInput = document.getElementById("driverid").value.trim();
    const bNoInput = document.getElementById("busno").value.trim();

    if (!dIdInput || !bNoInput) {
        alert("Please enter both Driver ID and Bus Number.");
        return;
    }

    try {
        // Step 1: Fetch Driver details (including phone) from the drivers node
        const driverRef = ref(db, 'drivers/' + dIdInput);
        const snapshot = await get(driverRef);

        if (!snapshot.exists()) {
            alert("Driver ID not found. Please register first.");
            return;
        }

        const driverData = snapshot.val();
        const driverPhone = driverData.phone; // Get phone number from drivers/105

        // Step 2: Start GPS tracking
        if (navigator.geolocation) {
            alert(`Tracking Started for Bus ${bNoInput}!`);

            navigator.geolocation.watchPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Step 3: Update the buses node with dId AND phone
                update(ref(db, 'buses/bus' + bNoInput), {
                    dId: parseInt(dIdInput),
                    latitude: lat,
                    longitude: lon,
                    phone: driverPhone, // Now the student can see this
                    lastUpdated: new Date().toLocaleTimeString()
                });

            }, (err) => {
                alert("GPS Error: Please enable location.");
            }, { enableHighAccuracy: true });
        }
    } catch (error) {
        console.error("Login Error:", error);
    }
};
