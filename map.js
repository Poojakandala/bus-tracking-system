import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 1. Initialize the Map (Centered on Hyderabad/Vignan area)
const map = L.map('map').setView([17.3850, 78.4867], 13);

// 2. Add OpenStreetMap Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// 3. Storage for active markers
const markers = {};

// 4. Custom Bus Emoji Icon
const busIcon = L.divIcon({
    html: '<div style="font-size: 30px;">🚌</div>',
    className: 'bus-marker',
    iconSize: [30, 30]
});

// 5. Listen for Live Data from 'buses' node
const busesRef = ref(db, 'buses');
onValue(busesRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Student Map Received Data:", data); // Check this in Laptop F12 Console

    if (!data) return;

    for (let id in data) {
        const bus = data[id];
        
        // Match these EXACTLY to your driver-login.js update() call
        const lat = parseFloat(bus.latitude); 
        const lon = parseFloat(bus.longitude);
        const busPhone = bus.phone;
        const driverID = bus.dId;

        if (!isNaN(lat) && !isNaN(lon)) {
            if (markers[id]) {
                // Move existing emoji
                markers[id].setLatLng([lat, lon]);
            } else {
                // Create new emoji marker
                markers[id] = L.marker([lat, lon], { icon: busIcon }).addTo(map);
                
                // AUTO-FOCUS: Make the map jump to the bus so it's not "invisible"
                map.flyTo([lat, lon], 16); 
            }

            // Update the click-to-call popup
            markers[id].bindPopup(`
                <div style="text-align: center;">
                    <b style="color: #003366;">Vignan Bus #${id}</b><br>
                    Driver ID: ${driverID}<br>
                    <hr>
                    <a href="tel:${busPhone}" style="display:block; background:#28a745; color:white; padding:10px; text-decoration:none; border-radius:5px; font-weight:bold;">
                        📞 Call Driver
                    </a>
                </div>
            `);
        }
    }
}, (error) => {
    console.error("Firebase Read Error:", error);
});
