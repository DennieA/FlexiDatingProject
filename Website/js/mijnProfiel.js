"use strict";

////////Login nakijken
let loginUrl = 'https://scrumserver.tenobe.org/scrum/api/profiel/read.php?';
fetch(loginUrl)
    .then(function (response){return response.json();})
    .then(loginCheck)
    .catch(function (error){console.log(error);});

function loginCheck (data){
    for (let el of data) {
        if (sessionStorage.getItem("userId") === el.id) {
            let wachtwoord = el.wachtwoord;
            let encryptedWachtwoord = CryptoJS.SHA256(wachtwoord).toString();
            if (sessionStorage.getItem("wachtwoord") !== encryptedWachtwoord) {
                window.location.href = "../Website/index.html";
            }
        }
    }
}

if (!sessionStorage.getItem("userId") || !sessionStorage.getItem("wachtwoord")){
    window.location.href = "../Website/index.html";
}
/////////

////////Logout
function logout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("wachtwoord");
    window.location.href = "../Website/index.html";
}
/////////

let user = sessionStorage.getItem("userId");

let hoofdDiv = document.getElementById("mid");
 
let voornaam = "";
let familienaam = "";
let geboortedatum = "";
let nickname = "";
let email = "";
let foto = "";
let beroep = "";
let sexe = "";
let haarkleur = "";
let oogkleur = "";
let grootte = "";
let gewicht = "";
let lovecoins = ""; 

/* zoek een gebruiker by nickname*/
let rooturl = "https://scrumserver.tenobe.org/scrum/api";
fetch(rooturl+"/profiel/read.php").then(function (resp){return resp.json()}).then(GebruikersGegevens);

function GebruikersGegevens (data){
    for (let el of data)
    if (el.id === user)
    {
        voornaam = el.voornaam;
        familienaam = el.familienaam;
        nickname = el.nickname;
        geboortedatum = el.geboortedatum;
        email = el.email;
        foto = el.foto;
        beroep = el.beroep;
        sexe = el.sexe;
        haarkleur = el.haarkleur;
        oogkleur = el.oogkleur;
        grootte = el.grootte;
        gewicht = el.gewicht;
        lovecoins = el.lovecoins;
    }
let nicknameVeld = document.createElement("h2");
nicknameVeld.innerText = "Hello "+ nickname;
nicknameVeld.id = "nickname";
hoofdDiv.appendChild(nicknameVeld);

let voornaamVeld = document.createElement("h3");
voornaamVeld.innerText = voornaam;
voornaamVeld.id = "voornaam";
hoofdDiv.appendChild(voornaamVeld);


let familienaamVeld = document.createElement("h3");
familienaamVeld.innerText = familienaam;
familienaamVeld.id = "voornaam";
hoofdDiv.appendChild(familienaamVeld);



//hoofdDiv.appendChild(document.createElement("br"));

let geboorteD = document.createElement("h3");
geboorteD.innerText = geboortedatum;
geboorteD.id = "geboortedatum";
hoofdDiv.appendChild(geboorteD);
}



