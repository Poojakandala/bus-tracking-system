import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Initialize Map - Center on Hyderabad/Vignan area initially
var map = L.map('map').setView([17.3850, 78.4867], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

var markers = {};

// Listen for Bus Data changes in 'buses' node
onValue(ref(db, 'buses'), (snapshot) => {
    const data = snapshot.val();
    console.log("Firebase Data Received:", data); // Check this in Laptop F12 Console

    if (!data) return;

    for (let id in data) {
        const bus = data[id];
        
        // IMPORTANT: These names MUST match your Firebase exactly
        const lat = bus.latitude; 
        const lon = bus.longitude;
        const phone = bus.phone;
        const dId = bus.dId;

        // Only draw if we actually have coordinates
        if (lat && lon) {
            if (markers[id]) {
                // Update existing marker
                markers[id].setLatLng([lat, lon]);
            } else {
                // Create new marker and AUTO-CENTER the map so you can find it!
                markers[id] = L.marker([lat, lon]).addTo(map);
                map.setView([lat, lon], 15); 
                console.log(`New marker created for Bus ${id} at ${lat}, ${lon}`);
            }

            // Update the popup content
            markers[id].bindPopup(`
                <div style="text-align: center;">
                    <b style="color: #003366;">Bus Number: ${id}</b><br>
                    Driver ID: ${dId}<br>
                    <hr>
                    <a href="tel:${phone}" style="display:block; background:#28a745; color:white; padding:10px; text-decoration:none; border-radius:5px; font-weight:bold;">
                        📞 Call Driver
                    </a>
                </div>
            `);
        } else {
            console.warn(`Bus ${id} has missing coordinates:`, bus);
        }
    }
});
