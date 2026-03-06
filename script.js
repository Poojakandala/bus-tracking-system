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
