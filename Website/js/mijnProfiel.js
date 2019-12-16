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

}

function koopLovecoins () {
    let url = 'https://scrumserver.tenobe.org/scrum/api/profiel/lovecoinTransfer.php';
    let aantalLovecoins = document.getElementById("aantalLovecoins").value
    if (aantalLovecoins === "") 
    {
        window.alert(" Gelieve dit veld in te vullen! ");
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

