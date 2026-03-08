import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

var map = L.map('map').setView([17.3850, 78.4867], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

var markers = {};

onValue(ref(db, 'buses'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    for (let id in data) {
        const bus = data[id];
        
        // Use parseFloat to guarantee these are treated as numbers
        const lat = parseFloat(bus.latitude); 
        const lon = parseFloat(bus.longitude);

        if (!isNaN(lat) && !isNaN(lon)) {
            if (markers[id]) {
                markers[id].setLatLng([lat, lon]);
            } else {
                markers[id] = L.marker([lat, lon]).addTo(map);
                // Jump to the bus the first time it appears
                map.flyTo([lat, lon], 15); 
            }

            markers[id].bindPopup(`
                <div style="text-align: center;">
                    <b>Vignan Bus #${id}</b><br>
                    Driver ID: ${bus.dId}<br>
                    <a href="tel:${bus.phone}" style="display:block; background:#28a745; color:white; padding:8px; margin-top:5px; text-decoration:none; border-radius:5px;">
                        📞 Call Driver
                    </a>
                </div>
            `);
        }
    }
});
