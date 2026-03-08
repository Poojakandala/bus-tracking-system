import { db } from "./firebase.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.startBus = async function() {
    const dId = document.getElementById("driverid").value;
    const bNo = document.getElementById("busno").value;

    if (!dId || !bNo) {
        alert("Please enter Driver ID and Bus Number");
        return;
    }

    // Step 1: Verify Driver Exists in Database
    const driverRef = ref(db, 'drivers/' + dId);
    const snapshot = await get(driverRef);

    if (!snapshot.exists()) {
        alert("Driver ID not found. Please signup first.");
        return;
    }

    // Step 2: Request GPS and Start Tracking
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            // Update the bus location in Firebase
            update(ref(db, 'buses/' + bNo), {
                driver: dId,
                latitude: lat,
                longitude: lng,
                lastUpdated: new Date().getTime()
            });
            
            console.log("Location sent to Firebase:", lat, lng);
        }, (err) => {
            alert("Error: Please enable GPS/Location permissions in your browser settings.");
        }, { enableHighAccuracy: true });

        alert("Login Successful! Tracking for Bus " + bNo + " is now live.");
    } else {
        alert("GPS is not supported by this browser.");
    }
};
