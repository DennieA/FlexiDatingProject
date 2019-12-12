"use strict";

fetch("https://scrumserver.tenobe.org/scrum/api/profiel/read.php").then(verwerkResponse);

function verwerkResponse(response) {

    if (response.ok) {
        response.json().then(verwerkUsers);
    } else {
        window.alert("read.php response nok");
    };
};

function verwerkUsers(users) {
    /* Zoek alle kenmerken klanten. */
    const oogkleuren = [];
    const haarkleuren = [];
    const beroepen = [];
    const sexes = [];
    users.forEach(
        user => {
            const zoekOogkleuren = oogkleuren.filter(oogkleur => oogkleur === user.oogkleur);
            if (zoekOogkleuren.length === 0) {
                oogkleuren.push(user.oogkleur);
            }

            const zoekHaarkleuren = haarkleuren.filter(haarkleur => haarkleur === user.haarkleur);
            if (zoekHaarkleuren.length === 0) {
                haarkleuren.push(user.haarkleur);
            }

            const zoekBeroepen = beroepen.filter(beroep => beroep === user.beroep);
            if (zoekBeroepen.length === 0) {
                beroepen.push(user.beroep);
            }

            const zoekSexes = sexes.filter(sexe => sexe === user.sexe);
            if (zoekSexes.length === 0) {
                sexes.push(user.sexe);
            }
        }
    );

    /* Vul de comboBox met de oogkleur items/options. */
    oogkleuren.forEach(
        oogkleur => {
            const comboBoxItem = document.createElement("option");
            comboBoxItem.innerText = oogkleur;
            comboBoxItem.value = oogkleur;
            /* Add comboBox item to the comboBox. */
            document.getElementById("oogkleur").appendChild(comboBoxItem);
        }
    )

    /* Vul de comboBox met de haarkleur items/options. */
    haarkleuren.forEach(
        haarkleur => {
            const comboBoxItem = document.createElement("option");
            comboBoxItem.innerText = haarkleur;
            comboBoxItem.value = haarkleur;
            /* Add comboBox item to the comboBox. */
            document.getElementById("haarkleur").appendChild(comboBoxItem);
        }
    )

    /* Vul de comboBox met de beroep items/options. */
    beroepen.forEach(
        beroep => {
            const comboBoxItem = document.createElement("option");
            comboBoxItem.innerText = beroep;
            comboBoxItem.value = beroep;
            /* Add comboBox item to the comboBox. */
            document.getElementById("beroep").appendChild(comboBoxItem);
        }
    )

    /* Vul de comboBox met de sexe items/options. */
    sexes.forEach(
        sexe => {
            const comboBoxItem = document.createElement("option");
            comboBoxItem.innerText = sexe;
            comboBoxItem.value = sexe;
            /* Add comboBox item to the comboBox. */
            document.getElementById("sexe").appendChild(comboBoxItem);
        }
    )
};

//function om juiste waarde op te halen

document.getElementById('zoeken').addEventListener('click', function (e) {

    let geslacht  =  document.getElementById('sexe').value;
    let oogkleur = document.getElementById('oogkleur').value;
    let haarkleur = document.getElementById('haarkleur').value;
    let beroep = document.getElementById('beroep').value;

    console.log(geslacht, oogkleur, haarkleur, beroep);

    let rangeMinAge = document.getElementById('minLeeftijd').value;
    let rangeMaxAge = document.getElementById('maxLeeftijd').value;

    console.log(rangeMinAge, rangeMaxAge);                              //test

    /*let rangeMinGeboortedatum = document.getElementById('input11_1').value;
    let rangeMaxGeboortedatum = document.getElementById('input11_2').value;*/
    
    let rangeMinGewicht = document.getElementById('minGewicht').value;
    let rangeMaxGewicht = document.getElementById('maxGewicht').value;
    let rangeMinGrootte = document.getElementById('minLengte').value;
    let rangeMaxGrootte = document.getElementById('maxLengte').value;

    let url = "https://scrumserver.tenobe.org/scrum/api" + '/profiel/search.php/'
    url += '?sexe='+ geslacht + '&oogkleur=' + oogkleur + '&haarkleur=' + haarkleur + '&beroep=' + beroep;
    /*url += '&geboortedatumOperator=range&rangeMinGeboortedatum=' + rangeMinGeboortedatum + '&rangeMaxGeboortedatum=' + rangeMaxGeboortedatum;*/
    url += '&gewichtOperator=range&rangeMinGewicht=' + rangeMinGewicht + '&rangeMaxGewicht=' + rangeMaxGewicht;
    url += '&grootteOperator=range&rangeMinGrootte=' + rangeMinGrootte + '&rangeMaxGrootte=' + rangeMaxGrootte;
    

    //LET OP : rooturl = https://scrumserver.tenobe.org/scrum/api
    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) { console.log(data); })
        .catch(function (error) { console.log(error); });
}
)