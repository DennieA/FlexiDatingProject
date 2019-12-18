"use strict";

let lovecoins = "";

////////Login nakijken
let loginUrl = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + parseInt(sessionStorage.getItem("userId"));
fetch(loginUrl)
    .then(function (response){return response.json();})
    .then(loginCheck)
    .catch(function (error){console.log(error);});

function loginCheck (data){
    let wachtwoord = data.wachtwoord;
    lovecoins = data.lovecoins;
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

// global variables
let rooturl = "https://scrumserver.tenobe.org/scrum/api";
let gegevens = [];

function unlock() {
    if (lovecoins === "0"){
        window.alert("Je hebt geen Lovecoins meer!")
    }
    else
    {
        let url5 = 'https://scrumserver.tenobe.org/scrum/api/profiel/lovecoinTransfer.php';
        let data2 = {
            "profielID": sessionStorage.getItem("userId"),
            "bedrag": "-1"
        }

        var request = new Request(url5, {
            method: 'PUT',
            body: JSON.stringify(data2),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        fetch(request)
        .then(function (response){return response.json();})
        .then(function (data){console.log(data);})
        .catch(function (error){console.log(error);});

        let url = rooturl + '/ontgrendeling/ontgrendel.php';
        //rooturl = https://scrumserver.tenobe.org/scrum/api
        let data = {
            mijnId: sessionStorage.getItem('userId'),
            anderId: sessionStorage.getItem('lastProfile')
        };
        console.log(sessionStorage.getItem('userId'))
        console.log(sessionStorage.getItem('lastProfile'))
        console.log(gegevens)

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
            .then(finishUnlock)
            .catch(function (error) { console.log(error); });
        function finishUnlock () {
            window.alert("1 lovecoin betaald, profiel unlocked!");
            window.location.href = "matchProfile.html";
        }
        }
        //koopLovecoins();
        // for( let x = 0; x<500; x++){}
        // window.location.href = "matchProfile.html"
    }
    

function removelastProfile()
    {
        sessionStorage.removeItem('lastProfile');
    }




let checkunlocked = false;
let checkfavourited = false;
let selectedNickname = sessionStorage.getItem('selectedNickname');
check();
checkfavourites();


function check() {

    let url = rooturl + '/ontgrendeling/wieIsVoorMijOntgrendeld.php?profielId=' + parseInt(sessionStorage.getItem('userId'));
    //LET OP : rooturl = https://scrumserver.tenobe.org/scrum/api
    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
            console.log(sessionStorage.getItem('lastProfile'))
            console.log(data);
            for (let x = 0; x < data.length; x++) {
                if (sessionStorage.getItem('lastProfile') !== "" && data !=="") {
                    if (sessionStorage.getItem('lastProfile') === data[x]) {
                        checkunlocked = true;
                        console.log("check = true");
                    }
                }
            };

        })
        .catch(function (error) { console.log(error); });


};

function checkfavourites() {
    let checkId = "";
    let url = rooturl + "/favoriet/read.php?profielId=" + sessionStorage.getItem("userId");
    //LET OP : rooturl = https://scrumserver.tenobe.org/scrum/api
    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
            for (let x = 0; x < data.length; x++) {
                checkId = data[x];
                checkId = checkId.anderId;
                if (sessionStorage.getItem('lastProfile') !== "" && checkId !=="") {
                    if (sessionStorage.getItem('lastProfile') === checkId) {
                        checkfavourited = true;
                    }
                }
            };

        })
        .catch(function (error) { console.log(error); });
}

function favoriet() {
    let mijnId =  sessionStorage.getItem("userId");
    let anderId =  sessionStorage.getItem("lastProfile");

    let rooturl3 = 'https://scrumserver.tenobe.org/scrum/api/favoriet/like.php';
    let data = {
        mijnId: mijnId,
        anderId: anderId
    }

    var request = new Request(rooturl3, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });

    fetch(request)
        .then( function (resp)  { return resp.json(); })
        .then( function (data)  { console.log(data);  })
        .then(finishFavourite)
        .catch(function (error) { console.log(error); });

    function finishFavourite () {
        window.alert("Favoriet toegevoegd!");
        document.getElementById("favorietKnop").style.visibility = "hidden"; 
    }
}


let hoofdDiv = document.getElementById("mid");
document.onload = function () {
    hoofdDiv.innerHTML = "";
}
let user = sessionStorage.getItem("userId");
console.log(user);



/* zoek een gebruiker op nickname*/
fetch(rooturl + "/profiel/read.php").then(function (resp) { return resp.json() }).then(readUsers);
function readUsers(data) {

    let titels = [];
    for (let el of data)
        if (el.nickname === selectedNickname) {
            gegevens.push(el.id);
            titels.push("Id");
            sessionStorage.setItem("lastProfile", el.id);

            gegevens.push(el.nickname);
            titels.push("Nickname");

            if (checkunlocked === false) {
                gegevens.push("unlock om te bekijken")
            } else {
                gegevens.push(el.foto);
            };

            titels.push("Foto");

            if (checkunlocked === false) {
                gegevens.push("unlock om te bekijken")
            } else {
                gegevens.push(el.voornaam);
            };

            titels.push("Voornaam");

            if (checkunlocked === false) {
                gegevens.push("unlock om te bekijken")
            } else {
                gegevens.push(el.familienaam);
            };

            titels.push("Familienaam");


            gegevens.push(el.geboortedatum);
            titels.push("Geboortedatum");
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
    //maakTabel
    let foto = document.createElement("img");
    foto.id = "uploadedFoto";
    foto.setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + gegevens[2]);
    console.log("naam van de foto: ", foto.src);
    foto.setAttribute('alt', 'unlock om foto te bekijken');
    hoofdDiv.appendChild(foto);

    let nicknameVeld = document.createElement("h2");
    nicknameVeld.innerText = "Profiel van: " + gegevens[1];
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

    for (let teller = 3; teller <= 11; teller++) {
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
        koopKnop.innerHTML = "<button id=\"koopKnop\"\" onclick=\"unlock()\">Unlock profiel = 1 Lovecoin</button>"
        hoofdDiv.appendChild(koopKnop);
    };
    if (checkfavourited === false) {
        let favorietKnop = document.createElement("p");
        favorietKnop.innerHTML = "<button id=\"favorietKnop\"\" onclick=\"favoriet()\">Toevoegen aan favorieten</button>"
        hoofdDiv.appendChild(favorietKnop);
    }
}


