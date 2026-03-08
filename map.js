import { db } from "./firebase.js";
import { ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Initialize the Map (Centered on Hyderabad by default)
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
    const buses = snapshot.val();
    for (let id in buses) {
        const data = buses[id];
        updateBusMarker(id, data);
    }
});

async function updateBusMarker(busNo, data) {
    const pos = [data.latitude, data.longitude];

    if (markers[busNo]) {
        markers[busNo].setLatLng(pos);
    } else {
        markers[busNo] = L.marker(pos).addTo(map);
        
        markers[busNo].on('click', async () => {
            // UPDATED: Using data.driver to match your screenshot
            const driverSnap = await get(ref(db, 'drivers/' + data.driver)); 
            const driver = driverSnap.val();
            
            markers[busNo].bindPopup(`
                <b>Bus: ${busNo}</b><br>
                Driver: ${driver ? driver.name : 'Unknown'}<br>
                Phone: ${data.phone || 'N/A'} 
            `).openPopup();
        });
    }
}

