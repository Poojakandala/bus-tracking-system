const firebaseConfig = {
apiKey: "AIzaSyAgjc3rXgx_JgUBvnTLv6c32HW4UNyu6Cw",
authDomain: "bus-tracking-system-78e94.firebaseapp.com",
databaseURL: "https://bus-tracking-system-78e94-default-rtdb.firebaseio.com",
projectId: "bus-tracking-system-78e94",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

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

db.ref("buses").on("value",function(snapshot){

let data=snapshot.val();

let text="";

for(let bus in data){

text += "Bus: "+bus+
" Driver: "+data[bus].driver+
" Lat: "+data[bus].latitude+
" Lon: "+data[bus].longitude+"<br><br>";

}

let div=document.getElementById("location");

if(div){
div.innerHTML=text;
}


});
