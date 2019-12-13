"use strict"

///////login nakijken
const loginUrl = "https://scrumserver.tenobe.org/scrum/api/profiel/authenticate.php"
let data = {
    nickname: sessionStorage.getItem("nickname"),
    wachtwoord: sessionStorage.getItem("wachtwoord")
}
let request = new Request(loginUrl, {
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
            window.location.href = "../main.html"
        }
    })
    .catch (function (error) { console.log(error); });
//////////

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
                sessionStorage.setItem("nickname", nickname.value);
                sessionStorage.setItem("wachtwoord", wachtwoord.value);
                window.location.href = "../main.html";
            }
            else {
                alert("Verkeerde gegevens!")
            }
        })
        .catch (function (error) { console.log(error); });
};