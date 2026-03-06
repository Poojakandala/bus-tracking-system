const firebaseConfig = {

apiKey: "YOUR_API_KEY",
authDomain: "bus-tracking-system-78e94.firebaseapp.com",
databaseURL: "https://bus-tracking-system-78e94-default-rtdb.firebaseio.com",
projectId: "bus-tracking-system-78e94",

};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

let map;
let studentMarker;

function initMap(){

navigator.geolocation.getCurrentPosition(function(position){

let studentLat = position.coords.latitude;
let studentLon = position.coords.longitude;

let studentLocation = {
lat:studentLat,
lng:studentLon
};

map = new google.maps.Map(document.getElementById("map"),{

zoom:13,
center:studentLocation

});

studentMarker = new google.maps.Marker({

position:studentLocation,
map:map,
title:"You"

});

loadBuses(studentLat,studentLon);

});

}

function loadBuses(studentLat,studentLon){

db.ref("buses").on("value",function(snapshot){

snapshot.forEach(function(bus){

let data = bus.val();

let busLocation = {

lat:data.latitude,
lng:data.longitude

};

let marker = new google.maps.Marker({

position:busLocation,
map:map,
title:bus.key

});

let distance = getDistance(studentLat,studentLon,data.latitude,data.longitude);

let info = new google.maps.InfoWindow({

content:
"Bus: "+bus.key+
"<br>Driver: "+data.driver+
"<br>Phone: "+data.phone+
"<br>Distance: "+distance+" km"

});

marker.addListener("click",function(){

info.open(map,marker);

});

});

});

}

function getDistance(lat1,lon1,lat2,lon2){

let R = 6371;

let dLat = (lat2-lat1)*Math.PI/180;
let dLon = (lon2-lon1)*Math.PI/180;

let a =
Math.sin(dLat/2)*Math.sin(dLat/2)+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLon/2)*Math.sin(dLon/2);

let c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

return (R*c).toFixed(2);

}

function driverStart(){

let driver=document.getElementById("driverid").value;
let bus=document.getElementById("busno").value;
let phone=document.getElementById("phone").value;

navigator.geolocation.watchPosition(function(position){

let lat=position.coords.latitude;
let lon=position.coords.longitude;

db.ref("buses/"+bus).set({

driver:driver,
phone:phone,
latitude:lat,
longitude:lon

});

});

alert("Bus tracking started");

}