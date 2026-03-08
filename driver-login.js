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
        // 1. Verify Driver and get their Phone Number
        const driverRef = ref(db, 'drivers/' + dIdInput);
        const snapshot = await get(driverRef);

        if (!snapshot.exists()) {
            alert("Driver ID not found! Register in the drivers node first.");
            return;
        }

        const driverData = snapshot.val();
        const driverPhone = driverData.phone; //

        // 2. Start GPS
        if (navigator.geolocation) {
            alert("GPS active. Tracking Bus " + bNoInput);
            
            navigator.geolocation.watchPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // 3. Update the specific bus node dynamically
                update(ref(db, 'buses/bus' + bNoInput), {
                    dId: parseInt(dIdInput), // Match integer format
                    latitude: lat,           //
                    longitude: lon,          //
                    phone: driverPhone,      // Added for student view
                    lastUpdated: new Date().toLocaleTimeString()
                });
            }, (err) => {
                alert("Please enable Location/GPS on your phone settings.");
            }, { enableHighAccuracy: true });
        }
    } catch (error) {
        console.error("Login Error:", error);
    }
};
