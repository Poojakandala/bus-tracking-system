import { db } from "./firebase.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.startBus = function(){

const driver = document.getElementById("driverId").value;
const bus = document.getElementById("busNo").value;

navigator.geolocation.watchPosition(function(position){

const lat = position.coords.latitude;
const lng = position.coords.longitude;

update(ref(db,'buses/'+bus),{

driverId:driver,
latitude:lat,
longitude:lng

});

});

alert("Bus Tracking Started");

}
