import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

var map = L.map('map').setView([17.44, 78.44], 12); // Hyderabad
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

var markers = {};
const busIcon = L.divIcon({ html: '<div style="font-size: 30px;">🚌</div>', className: 'bus-ico' });

onValue(ref(db, 'buses'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    for (let id in data) {
        const bus = data[id];
        // parseFloat ensures these are treated as numbers, not text
        const lat = parseFloat(bus.latitude); 
        const lon = parseFloat(bus.longitude);

        if (!isNaN(lat) && !isNaN(lon)) {
            if (markers[id]) {
                markers[id].setLatLng([lat, lon]);
            } else {
                markers[id] = L.marker([lat, lon], { icon: busIcon }).addTo(map);
                // Fly to the first bus found so the map isn't "empty"
                map.flyTo([lat, lon], 15);
            }
            markers[id].bindPopup(`<b>Bus #${id}</b><br>Driver ID: ${bus.dId}<br><a href="tel:${bus.phone}">📞 Call Driver</a>`);
        }
    }
});
// ... all your existing code (Firebase imports, startBus function, etc.) ...

// ADD IT AT THE VERY BOTTOM OF THE FILE
window.logoutUser = function() {
    if (confirm("Are you sure you want to logout?")) {
        // This stops the phone's GPS from draining battery after logout
        if (typeof watchID !== 'undefined') {
            navigator.geolocation.clearWatch(watchID);
        }
        
        // Redirects to your main landing page
        window.location.href = "index.html";
    }
};
