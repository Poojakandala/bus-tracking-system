// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgjc3rXgx_JgUBvnTLv6c32HW4UNyu6Cw",
  authDomain: "bus-tracking-system-78e94.firebaseapp.com",
  databaseURL: "https://bus-tracking-system-78e94-default-rtdb.firebaseio.com",
  projectId: "bus-tracking-system-78e94",
  storageBucket: "bus-tracking-system-78e94.appspot.com",
  messagingSenderId: "316084412095",
  appId: "1:316084412095:web:6438bdbf0e7599b5c2f00a"
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



