import { db } from "./firebase.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.registerStudent = async function() {
    const roll = document.getElementById("roll").value;
    const name = document.getElementById("name").value;
    const pass = document.getElementById("password").value;

    if(!roll || !name || !pass) return alert("Please fill all fields");

    const studentRef = ref(db, 'students/' + roll);
    
    try {
        // Step 1: Check if the roll number already exists
        const snapshot = await get(studentRef);
        
        if (snapshot.exists()) {
            alert("This Roll Number is already registered! Please login.");
            window.location.href = "student-login.html";
            return;
        }

        // Step 2: If it's a new user, proceed with registration
        await set(studentRef, {
            name: name,
            password: pass
        });
        
        alert("Registration Successful!");
        window.location.href = "student-login.html";

    } catch (error) {
        console.error("Signup Error:", error);
        alert("An error occurred. Please try again.");
    }
};
