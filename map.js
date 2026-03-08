import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

var map = L.map('map').setView([17.44, 78.44], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

var markers = {};

onValue(ref(db, 'buses'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    for (let id in data) {
        const bus = data[id];
        // Ensure keys match your screenshot exactly
        const lat = bus.latitude; 
        const lon = bus.longitude;
        const dId = bus.dId; 
        const phone = bus.phone;

        if (markers[id]) {
            markers[id].setLatLng([lat, lon]);
        } else {
            markers[id] = L.marker([lat, lon]).addTo(map);
        }

        markers[id].bindPopup(`
            <div style="text-align: center;">
                <b>Vignan Bus: ${id}</b><br>
                Driver ID: ${dId}<br>
                <a href="tel:${phone}" style="display:block; background:#28a745; color:white; padding:8px; margin-top:5px; text-decoration:none; border-radius:4px;">
                    📞 Call: ${phone}
                </a>
            </div>
        `);
    }
});
