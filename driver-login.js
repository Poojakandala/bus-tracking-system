import { db } from "./firebase.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.startBus = function() {
    const driver = document.getElementById("driverid").value; // Fixed ID case
    const bus = document.getElementById("busno").value;

    if (!driver || !bus) return alert("Fill all fields");

    navigator.geolocation.watchPosition((position) => {
        update(ref(db, 'buses/' + bus), {
            driverId: driver,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            lastUpdated: Date.now()
        });
    }, (err) => console.error(err), { enableHighAccuracy: true });

    alert("Tracking started for Bus: " + bus);
};
