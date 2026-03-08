import { db } from "./firebase.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Make the function available to the HTML button
window.startBus = async function() {
    const dIdInput = document.getElementById("driverid").value.trim();
    const bNoInput = document.getElementById("busno").value.trim();

    // 1. Basic Validation
    if (!dIdInput || !bNoInput) {
        alert("Please enter both your Driver ID and Bus Number.");
        return;
    }

    try {
        // 2. Authenticate: Check if Driver exists in 'drivers' node
        const driverRef = ref(db, 'drivers/' + dIdInput);
        const snapshot = await get(driverRef);

        if (!snapshot.exists()) {
            alert("Invalid Driver ID. Please register first.");
            return;
        }

        const driverData = snapshot.val();
        const driverPhone = driverData.phone; // Fetched from drivers profile
        const driverName = driverData.name;

        // 3. Start Geolocation Tracking
        if (navigator.geolocation) {
            alert(`Welcome ${driverName}! Tracking started for Bus ${bNoInput}. Keep this tab open.`);

            navigator.geolocation.watchPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // 4. Update the 'buses' node using the numeric ID (e.g., 'buses/1')
                const busPath = 'buses/' + bNoInput;
                
                update(ref(db, busPath), {
                    dId: parseInt(dIdInput),    // Matches your integer format
                    latitude: lat,              // Matches your screenshot key
                    longitude: lon,             // Matches your screenshot key
                    phone: driverPhone,         // Saved for student map click
                    lastUpdated: new Date().toLocaleTimeString()
                }).then(() => {
                    console.log(`Updated Bus ${bNoInput} successfully!`);
                });

            }, (error) => {
                // Handle common GPS errors
                if (error.code === error.PERMISSION_DENIED) {
                    alert("ERROR: Location permission denied. Please click the lock icon in your browser and select 'Allow' for Location.");
                } else {
                    alert("GPS Error: " + error.message);
                }
            }, {
                enableHighAccuracy: true, // Uses GPS for better precision
                maximumAge: 0,            // Do not use cached location
                timeout: 5000             // Wait 5 seconds for a fix
            });

        } else {
            alert("Your browser does not support GPS tracking.");
        }

    } catch (err) {
        console.error("Firebase Error:", err);
        alert("System Error: " + err.message);
    }
};
