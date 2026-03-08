import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Initialize the Map (Centered on Hyderabad)
var map = L.map('map').setView([17.44, 78.44], 13);

// Add Free OpenStreetMap Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Storage for active bus markers
var markers = {};

// Listen for Bus Data changes in Firebase
const busesRef = ref(db, 'buses');
onValue(busesRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    for (let id in data) {
        const bus = data[id];
        const lat = bus.latitude; //
        const lon = bus.longitude; //
        const busPhone = bus.phone; // Pulled from your updated node
        const driverID = bus.dId;   // Integer dId field

        if (markers[id]) {
            // Update position
            markers[id].setLatLng([lat, lon]);
        } else {
            // Create new marker
            markers[id] = L.marker([lat, lon]).addTo(map);
        }

        // Update the popup content every time data changes
        markers[id].bindPopup(`
            <div style="text-align: center; font-family: sans-serif;">
                <b style="font-size: 1.1em; color: #003366;">Vignan Bus: ${id}</b><br>
                <span style="color: #555;">Driver ID: ${driverID}</span>
                <hr style="margin: 8px 0; border: 0; border-top: 1px solid #eee;">
                <a href="tel:${busPhone}" style="
                    display: inline-block; 
                    background: #28a745; 
                    color: white; 
                    padding: 10px 15px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    font-weight: bold;">
                    📞 Call Driver: ${busPhone}
                </a>
            </div>
        `);
    }
});
