// Initialize Firebase
const firebaseConfig = {
apiKey: "AIzaSyAgjc3rXgx_JgUBvnTLv6c32HW4UNyu6Cw",
authDomain: "bus-tracking-system-78e94.firebaseapp.com",
databaseURL: "https://bus-tracking-system-78e94-default-rtdb.firebaseio.com",
projectId: "bus-tracking-system-78e94",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();


// MAP
var map = new google.maps.Map(document.getElementById("map"),{

zoom:13,
center:{lat:17.44,lng:78.44}

});


// SHOW BUSES
db.ref("buses").on("value",function(snapshot){

const buses = snapshot.val();

for(let busNo in buses){

const bus = buses[busNo];

const marker = new google.maps.Marker({

position:{lat:bus.latitude,lng:bus.longitude},
map:map,
icon:"https://maps.google.com/mapfiles/kml/shapes/bus.png"

});


// CLICK BUS -> DRIVER DETAILS
marker.addListener("click",function(){

db.ref("drivers/"+bus.driver).once("value",function(snap){

const driver = snap.val();

alert(
"Bus Number: "+busNo+
"\nDriver: "+driver.name+
"\nPhone: "+driver.phone
);

});

});

}

});


// STUDENT LOGIN
function studentLogin(){

let roll = document.getElementById("roll").value;
let password = document.getElementById("password").value;

db.ref("students/"+roll).once("value",function(snapshot){

if(snapshot.exists()){

let data = snapshot.val();

if(data.password == password){
window.location="map.html";
}
else{
alert("Wrong Password");
}

}
else{
alert("Student not found");
}

});

}


// DRIVER START BUS
function driverStart(){

let driverid=document.getElementById("driverid").value;
let busno=document.getElementById("busno").value;

navigator.geolocation.watchPosition(function(position){

let lat=position.coords.latitude;
let lon=position.coords.longitude;

db.ref("buses/"+busno).set({

driver:driverid,
latitude:lat,
longitude:lon

});

});

alert("Bus tracking started");

}
