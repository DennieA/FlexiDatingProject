"use strict";

////////Login nakijken
let loginUrl = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + parseInt(sessionStorage.getItem("userId"));
fetch(loginUrl)
    .then(function (response){return response.json();})
    .then(loginCheck)
    .catch(function (error){console.log(error);});

function loginCheck (data){
    let wachtwoord = data.wachtwoord;
    let encryptedWachtwoord = CryptoJS.SHA256(wachtwoord).toString();
    if (sessionStorage.getItem("wachtwoord") !== encryptedWachtwoord) {
        window.location.href = "../Website/index.html";
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


let hoofdDiv = document.getElementById("mid");
document.onload = function ()
{
    hoofdDiv.innerHTML = "";
}
let user = sessionStorage.getItem("userId");
console.log(user);

 

/* zoek een gebruiker op id*/
let rooturl = "https://scrumserver.tenobe.org/scrum/api";
fetch(rooturl+"/profiel/read.php").then(function (resp){return resp.json()}).then(GebruikersGegevens);

function GebruikersGegevens (data){
    let gegevens = [];
    let titels = [];
    for (let el of data)
    if (el.id === user)
    {
        gegevens.push(el.id);
        titels.push("Id");
        gegevens.push(el.nickname);
        titels.push("Nickname")
        gegevens.push(el.foto);
        titels.push("Foto");
        gegevens.push(el.voornaam);
        titels.push("Voornaam");
        gegevens.push(el.familienaam);
        titels.push("Familienaam");
        gegevens.push(el.geboortedatum);
        titels.push("Geboortedatum");
        gegevens.push(el.email);
        titels.push("Email");
        gegevens.push(el.beroep);
        titels.push("Beroep");
        gegevens.push(el.sexe);
        titels.push("Sexe");
        gegevens.push(el.haarkleur);
        titels.push("Haarkleur");
        gegevens.push(el.oogkleur);
        titels.push("Oogkleur");
        gegevens.push(el.grootte);
        titels.push("Grootte");
        gegevens.push(el.gewicht);
        titels.push("Gewicht");
        gegevens.push(el.lovecoins);
        titels.push("Lovecoins");
    }

let foto = document.createElement("img");
foto.id = "uploadedFoto";
foto.setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + gegevens[2]);
console.log("naam van de foto: ", foto.src);
foto.setAttribute('alt', 'foto van ' + gegevens[3] + ' ' + gegevens[4]);
hoofdDiv.appendChild(foto);

let nicknameVeld = document.createElement("h2");
nicknameVeld.innerText = "Hello "+ gegevens[1];
nicknameVeld.id = "nickname";
hoofdDiv.appendChild(nicknameVeld);


let tabel = document.createElement("table");
tabel.id = "tabel";
hoofdDiv.appendChild(tabel);

let hoofdRij = document.createElement("tr");
hoofdRij.id = "hoofdRij";
tabel.appendChild(hoofdRij);
let hoofdTh = document.createElement("th");
hoofdTh.innerText = "Profielgegevens";
hoofdTh.id = "hoofdRij";
hoofdTh.colSpan = 3;
hoofdRij.appendChild(hoofdTh);

for (let teller = 3; teller<=13; teller++)
{
let rij = document.createElement("tr");
tabel.appendChild(rij);
let titel = document.createElement("th");
titel.innerText = titels[teller]+": ";
rij.appendChild(titel);
let veld = document.createElement("td");
veld.innerText = gegevens[teller];
rij.appendChild(veld);
}

let koopKnop = document.createElement("p");
koopKnop.innerHTML = "<input type=\"number\" id=\"aantalLovecoins\" min=\"1\"></input><button id=\"koopKnop\" value=\"Koop Lovecoins\" onclick=\"koopLovecoins()\">Koop Lovecoins</button>"
hoofdDiv.appendChild(koopKnop);
///
tabel2();
}

function tabel2() {
    let rooturl2 = "https://scrumserver.tenobe.org/scrum/api";
    fetch(rooturl2+"/favoriet/read.php?profielId=" + sessionStorage.getItem("userId")).then(function (resp){return resp.json()}).then(favorietenTonen);

    function favorietenTonen(data) {
        let ids = [];
        let nicknames = [];
        let teller2 = 0;

        for (let el of data){
            ids.push(el.anderId);
            teller2++;
        }

        
        let rooturl4 = "https://scrumserver.tenobe.org/scrum/api";
        fetch(rooturl4+"/profiel/read.php").then(function (resp){return resp.json()}).then(nicknameOverlopen).then(toonTabel);
        function nicknameOverlopen (data){
            for (let j = 0; j <= ids.length; j++){
                for (let el of data) {
                    if (ids[j] === el.id) {
                        nicknames.push(el.nickname);
                    }
                }
            }
        }
        function toonTabel () {
            let tabel2 = document.createElement("table");
            tabel2.id = "tabel2";
            hoofdDiv.appendChild(tabel2);
            let hoofdRij2 = document.createElement("tr");
            hoofdRij2.id = "hoofdRij2";
            tabel2.appendChild(hoofdRij2);
            let hoofdTh2 = document.createElement("th");
            hoofdTh2.innerText = "Favorieten";
            hoofdTh2.id = "hoofdRij2";
            hoofdTh2.colSpan = 3;
            hoofdRij2.appendChild(hoofdTh2);
            if (typeof ids[0] !== "undefined") {

            for (let teller3 = 0; teller3 < teller2; teller3++)
            {
                let rij2 = document.createElement("tr");
                tabel2.appendChild(rij2);
                let veld2 = document.createElement("td");
                veld2.innerHTML =  "<a onclick=\"matchProfielLaden(\'" + nicknames[teller3] + "\')\">" + nicknames[teller3] + "</a>";
                rij2.appendChild(veld2);
            }
        }
        }
    }
}

function matchProfielLaden (nickname) {
    console.log(nickname);
    sessionStorage.setItem("selectedNickname", nickname);
    window.location.href = "matchProfile.html";
}
///

function koopLovecoins() {
    let url = 'https://scrumserver.tenobe.org/scrum/api/profiel/lovecoinTransfer.php';
    let aantalLovecoins = document.getElementById("aantalLovecoins").value
    if (aantalLovecoins === "") 
    {
        window.alert(" Gelieve dit veld in te vullen! ");
    }
    else if (aantalLovecoins <= 0) 
    {
        window.alert(" Deze waarde moet positief zijn! ")
    }
    else
    {
        let data = {
            "profielID": sessionStorage.getItem("userId"),
            "bedrag": aantalLovecoins.toString()
        }

        var request = new Request(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        fetch(request)
        .then(function (response){return response.json();})
        .then(function (data){console.log(data);})
        .catch(function (error){console.log(error);});

        window.alert("Lovecoins zijn toegevoegd!");
        window.location.href = "mijnProfiel.html";
    }
}

function uitschrijven()
{
    if (window.confirm("Uitschrijven bevestigen"))
    {
    let url=rooturl+'/profiel/delete.php';
    
    let data = {
        id: user
    }

    var request = new Request(url, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
    
    fetch(request)
        .then( function (resp)  { return resp.json(); })
        .then( function (data)  { console.log(data); window.location.href = "index.html";
    })
        .catch(function (error) { console.log(error); });
}
}

