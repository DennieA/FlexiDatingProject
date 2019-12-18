"use strict"

////////Login nakijken
let loginUrl = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + parseInt(sessionStorage.getItem("userId"));
fetch(loginUrl)
    .then(function (response){return response.json();})
    .then(loginCheck)
    .catch(function (error){console.log(error);});

function loginCheck (data){
    let wachtwoord = data.wachtwoord;
    let encryptedWachtwoord = CryptoJS.SHA256(wachtwoord).toString();
    if (sessionStorage.getItem("wachtwoord") === encryptedWachtwoord) {
        window.location.href = "../Website/main.html";
    }
}
/////////

const url = "https://scrumserver.tenobe.org/scrum/api/profiel/authenticate.php"
let nickname = document.getElementById("nickname");
let wachtwoord = document.getElementById("wachtwoord");


document.getElementById("button").onclick = function() {
    if (nickname.value === '' || wachtwoord.value === ''){
        alert("Beide velden moeten ingevuld zijn!");
    }
    else {
        login();
    }
}

function login() {
    let data = {
        nickname: nickname.value,
        wachtwoord: wachtwoord.value
    }
    let request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });

    fetch(request)
        .then(function (response) { return response.json();})
        .then(function (data) {
            if (data.message == 'Authorized') {
                sessionStorage.setItem("userId", data.id);
                sessionStorage.setItem("wachtwoord", CryptoJS.SHA256(wachtwoord.value).toString());
                window.location.href = "main.html";
            }
            else {
                alert("Verkeerde gegevens!")
            }
        })
        .catch (function (error) { console.log(error); });
};