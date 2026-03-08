import { db } from "./firebase.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.studentLogin = async function() {
    const roll = document.getElementById("roll").value;
    const password = document.getElementById("password").value;

    if (!roll || !password) {
        alert("Please enter both Roll Number and Password");
        return;
    }

    try {
        // Fetch student data from 'students' node
        const studentRef = ref(db, 'students/' + roll);
        const snapshot = await get(studentRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Validate password
            if (data.password === password) {
                alert("Login successful!");
                window.location.href = "map.html"; // Redirect to the map
            } else {
                alert("Incorrect password. Please try again.");
            }
        } else {
            alert("Student record not found. Please contact admin.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred during login.");
    }
};
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
