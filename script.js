// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "bus-tracking-system.firebaseapp.com",
  databaseURL: "https://bus-tracking-system-78e94-default-rtdb.firebaseio.com",
  projectId: "bus-tracking-system",
  storageBucket: "bus-tracking-system.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Connect to database
const database = firebase.database();

function studentLogin(){

let roll=document.getElementById("roll").value;
let password=document.getElementById("password").value;

firebase.database().ref("students/"+roll).once("value",function(snapshot){

if(snapshot.exists()){

let data=snapshot.val();

if(data.password==password){

alert("Login successful");

window.location.href="map.html";

}
else{

alert("Wrong password");

}

}
else{

alert("Student not found");

}

});

}

