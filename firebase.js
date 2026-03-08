import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgjc3rXgx_JgUBvnTLv6c32HW4UNyu6Cw",
    authDomain: "bus-tracking-system-78e94.firebaseapp.com",
    databaseURL: "https://bus-tracking-system-78e94-default-rtdb.firebaseio.com",
    projectId: "bus-tracking-system-78e94"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
