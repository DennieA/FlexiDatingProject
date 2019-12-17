"use strict";

let rooturl = "https://scrumserver.tenobe.org/scrum/api";

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

function unlock() {

    let url = rooturl + '/ontgrendeling/ontgrendel.php';
    //LET OP : rooturl = https://scrumserver.tenobe.org/scrum/api
    let data = {
        mijnId: sessionStorage.getItem('userId'),
        anderId: sessionStorage.getItem('selectedId')
    }

    var request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });

    fetch(request)
        .then(function (resp) { return resp.json(); })
        .then(function (data) { console.log(data); })
        .catch(function (error) { console.log(error); });
    ;


    window.location.href = "matchProfile.html"
};


let checkunlocked = false;
let checkfavorite = false;
let selectedId = 505;








let hoofdDiv = document.getElementById("mid");
document.onload = function () {
    hoofdDiv.innerHTML = "";
}
let user = sessionStorage.getItem("userId");
console.log(user);



/* zoek een gebruiker op id*/
fetch(rooturl + "/profiel/read.php").then(function (resp) { return resp.json() }).then(SelectedId);

function SelectedId(data) {
    let gegevens = [];
    let titels = [];
    for (let el of data)
        if (el.id === selectedId) {
            gegevens.push(el.id);
            titels.push("Id");


            if (checkunlocked = false) {
                gegevens.push("unlock om te bekijken")
            } else {
                gegevens.push(el.nickname);

            };
            titels.push("Nickname")
            if (checkunlocked = false) {
                gegevens.push("unlock om te bekijken")
            } else {
                gegevens.push(el.foto);
            };

            titels.push("Foto");
            if (checkunlocked = false) {
                gegevens.push("unlock om te bekijken")
            } else {
                gegevens.push(el.voornaam);
            };

            titels.push("Voornaam");
            if (checkunlocked = false) {
                gegevens.push("unlock om te bekijken")
            } else {
                gegevens.push(el.familienaam);
            };


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

        }

    let foto = document.createElement("img");
    foto.id = "uploadedFoto";
    foto.setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + gegevens[2]);
    console.log("naam van de foto: ", foto.src);
    foto.setAttribute('alt', 'foto van ' + gegevens[3] + ' ' + gegevens[4]);
    hoofdDiv.appendChild(foto);

    let nicknameVeld = document.createElement("h2");
    nicknameVeld.innerText = "Hello " + gegevens[1];
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

    for (let teller = 3; teller <= 13; teller++) {
        let rij = document.createElement("tr");
        tabel.appendChild(rij);
        let titel = document.createElement("th");
        titel.innerText = titels[teller] + ": ";
        rij.appendChild(titel);
        let veld = document.createElement("td");
        veld.innerText = gegevens[teller];
        rij.appendChild(veld);
    }
    if (checkunlocked === false) {
        let koopKnop = document.createElement("p");
        koopKnop.innerHTML = "<button id=\"koopKnop\"\" onclick=\"unlock()\">Unlock profile</button>"
        hoofdDiv.appendChild(koopKnop);
    };
}


