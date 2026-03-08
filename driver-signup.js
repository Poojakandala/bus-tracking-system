import { db } from "./firebase.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.signupDriver = function(){

const id = document.getElementById("driverId").value;
const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;

set(ref(db,'drivers/'+id),{

name:name,
phone:phone

});

alert("Driver Registered");

}
