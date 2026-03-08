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
        // Update existing marker position
        markers[busNo].setLatLng(pos);
    } else {
        // Create new marker if it doesn't exist
        markers[busNo] = L.marker(pos).addTo(map);
        
        // Add click event to fetch Driver details from 'drivers' node
        markers[busNo].on('click', async () => {
            const driverSnap = await get(ref(db, 'drivers/' + data.driverId));
            const driver = driverSnap.val();
            
            markers[busNo].bindPopup(`
                <b>Bus: ${busNo}</b><br>
                Driver: ${driver ? driver.name : 'Unknown'}<br>
                Phone: ${driver ? driver.phone : 'N/A'}
            `).openPopup();
        });
    }
}
