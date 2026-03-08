import { db } from "./firebase.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.startBus = function() {
    console.log("Button Clicked!"); // Check this in Console
    
    const dId = document.getElementById("driverid").value;
    const bNo = document.getElementById("busno").value;

    if (!dId || !bNo) {
        alert("Please enter both Driver ID and Bus Number");
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    console.log("Requesting GPS Permission...");
    navigator.geolocation.watchPosition(
        (pos) => {
            console.log("GPS Lock Acquired:", pos.coords.latitude, pos.coords.longitude);
            
            update(ref(db, 'buses/' + bNo), {
                driver: dId,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            }).then(() => {
                console.log("Firebase Updated successfully!");
            }).catch((error) => {
                console.error("Firebase Update Failed:", error);
            });
        },
        (err) => {
            console.error("GPS Error Code:", err.code, err.message);
            alert("Please enable Location/GPS services on your device.");
        },
        { enableHighAccuracy: true }
    );

    alert("Tracking active for Bus " + bNo + ". Please check the map!");
};
