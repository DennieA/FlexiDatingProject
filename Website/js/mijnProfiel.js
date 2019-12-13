"use strict";

let user = sessionStorage.getItem("gebruiker");

let hoofdDiv = document.getElementById("mid");

let nickname = document.createElement("h2");
nickname.innerText = "Hello "+ user;
nickname.id = "nickname";
hoofdDiv.appendChild(nickname);
 
let voornaam = "";
let familienaam = "";
let geboortedatum = "";
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
    if (el.nickname === user)
    {
        voornaam = el.voornaam;
        familienaam = el.familienaam;
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



