import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Original project's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAgjc3rXgx_JgUBvnTLv6c32HW4UNyu6Cw",
    authDomain: "bus-tracking-system-vignan.firebaseapp.com",
    databaseURL: "https://bus-tracking-system-vignan-default-rtdb.firebaseio.com",
    projectId: "bus-tracking-system-vignan",
    storageBucket: "bus-tracking-system-vignan.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:000000000000000000000000"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
