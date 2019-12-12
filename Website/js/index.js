"use strict"

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
        nickname: nickname,
        wachtwoord: wachtwoord
    }
    let request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });

    fetch(request)
        .then(function (resp) { return resp.json();})
        .then(function (data) {
            if (data.message == 'Authorized')
                console.log("Correcte gegevens");
            else {
                console.log("Verkeerde gegevens");
            }
        })
        .catch (function (error) { console.log(error); });
};