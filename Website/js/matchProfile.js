"use strict";

////////Login nakijken
// let loginUrl = 'https://scrumserver.tenobe.org/scrum/api/profiel/read.php?';
// fetch(loginUrl)
//     .then(function (response){return response.json();})
//     .then(loginCheck)
//     .catch(function (error){console.log(error);});

// function loginCheck (data){
//     for (let el of data) {
//         if (sessionStorage.getItem("userId") === el.id) {
//             let wachtwoord = el.wachtwoord;
//             let encryptedWachtwoord = CryptoJS.SHA256(wachtwoord).toString();
//             if (sessionStorage.getItem("wachtwoord") !== encryptedWachtwoord) {
//                 window.location.href = "../Website/index.html";
//             }
//         }
//     }
// }

// if (!sessionStorage.getItem("userId") || !sessionStorage.getItem("wachtwoord")){
//     window.location.href = "../Website/index.html";
// }
/////////

////////Logout
function logout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("wachtwoord");
    window.location.href = "index.html";
}
/////////


let checkunlocked = false; 
let checkfavorite = false; 

if (checkunlocked = true){
    //show verborgen velden, hide unlock button; 
};


