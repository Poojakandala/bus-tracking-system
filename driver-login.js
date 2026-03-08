import { db } from "./firebase.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.startBus = async function() {
    console.log("Login attempt started...");

    // Get values from HTML inputs
    const dId = document.getElementById("driverid").value.trim();
    const bNo = document.getElementById("busno").value.trim();

    // 1. Basic Validation
    if (!dId || !bNo) {
        alert("Please enter both Driver ID and Bus Number.");
        return;
    }

    try {
        // 2. Verify Driver exists in the 'drivers' node
        // Even if dId is an integer like 105, Firebase paths are strings
        const driverRef = ref(db, 'drivers/' + dId);
        const snapshot = await get(driverRef);

        if (!snapshot.exists()) {
            alert("Driver ID " + dId + " not found! Please register first.");
            return;
        }

        const driverData = snapshot.val();
        console.log("Driver verified:", driverData.name);

        // 3. Request GPS and Start Real-Time Tracking
        if (navigator.geolocation) {
            alert("Success! Starting tracking for Bus " + bNo);
            
            navigator.geolocation.watchPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // 4. Update the 'buses' node with live data
                    // We save dId here so we know who is currently driving this bus
                    update(ref(db, 'buses/bus' + bNo), {
                        driverID: parseInt(dId), // Saving as integer as requested
                        latitude: lat,
                        longitude: lon,
                        lastUpdated: new Date().toISOString()
                    }).then(() => {
                        console.log("Firebase updated: ", lat, lon);
                    });
                },
                (error) => {
                    console.error("GPS Error:", error);
                    alert("GPS Error: Please enable location services on your device.");
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 5000
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }

    } catch (err) {
        console.error("Database Error:", err);
        alert("A connection error occurred. Check your internet.");
    }
};
