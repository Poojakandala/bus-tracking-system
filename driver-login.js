import { db } from "./firebase.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.startBus = function() {
    const driver = document.getElementById("driverid").value;
    const bus = document.getElementById("busno").value;

    if (!driver || !bus) return alert("Please enter all details");

    navigator.geolocation.watchPosition((position) => {
        update(ref(db, 'buses/' + bus), {
            // CHANGE THIS LINE: 
            driver: driver, // Matches your Firebase key "driver"
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, (err) => console.error(err), { enableHighAccuracy: true });

    alert("Tracking active. Keep this window open!");
};
