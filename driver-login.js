import { db } from "./firebase.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.startBus = function() {
    // These IDs must match your HTML exactly
    const driverInput = document.getElementById("driverid"); 
    const busInput = document.getElementById("busno");

    if (!driverInput.value || !busInput.value) {
        alert("Please enter both Driver ID and Bus Number");
        return;
    }

    const driver = driverInput.value;
    const bus = busInput.value;

    // Check if browser supports GPS
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const updates = {};
            updates['buses/' + bus + '/driver'] = driver;
            updates['buses/' + bus + '/latitude'] = position.coords.latitude;
            updates['buses/' + bus + '/longitude'] = position.coords.longitude;

            update(ref(db), updates)
                .then(() => console.log("Location updated"))
                .catch((err) => console.error("Firebase Error:", err));
        }, (error) => {
            alert("Error: Please enable GPS/Location services.");
        }, { enableHighAccuracy: true });

        alert("Tracking active for Bus: " + bus + ". Keep this tab open!");
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};
