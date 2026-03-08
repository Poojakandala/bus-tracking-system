import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Initialize Map centered on Hyderabad
var map = L.map('map').setView([17.44, 78.44], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

var markers = {};

// Custom Bus Emoji Icon
const busIcon = L.divIcon({
    html: '<div style="font-size: 35px; cursor: pointer;">🚌</div>',
    className: 'bus-marker',
    iconSize: [35, 35],
    iconAnchor: [17, 17]
});

// Listen to the 'buses' node
onValue(ref(db, 'buses'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    for (let id in data) {
        const bus = data[id];
        
        // Convert to numbers to ensure Leaflet can read them
        const lat = parseFloat(bus.latitude); 
        const lon = parseFloat(bus.longitude);

        if (!isNaN(lat) && !isNaN(lon)) {
            if (markers[id]) {
                // Update existing emoji position
                markers[id].setLatLng([lat, lon]);
            } else {
                // Create new emoji marker
                markers[id] = L.marker([lat, lon], { icon: busIcon }).addTo(map);
                
                // Fly to the bus immediately so the map isn't empty
                map.flyTo([lat, lon], 16); 
            }

            // Click Details: Show Driver ID and Phone
            markers[id].bindPopup(`
                <div style="text-align: center; min-width: 150px;">
                    <h3 style="margin: 0; color: #003366;">Vignan Bus #${id}</h3>
                    <p style="margin: 5px 0;"><b>Driver ID:</b> ${bus.dId}</p>
                    <hr>
                    <a href="tel:${bus.phone}" style="display: block; background: #28a745; color: white; padding: 10px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                        📞 Call Driver
                    </a>
                </div>
            `);
        }
    }
});
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

