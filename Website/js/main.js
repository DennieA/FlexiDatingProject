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
    /* Zoek kenmerken klanten. */
    const oogkleuren = [];
    const haarkleuren = [];
    const beroepen = [];
    const sexes = [];
    let minLengte = 999;
    let maxLengte = 0;
    let minGewicht = 999;
    let maxGewicht = 0;
    let minLeeftijd = 999;
    let maxLeeftijd = 0;
    let leeftijd = 0;

    users.forEach(
        user => {
            /* Zoek alle oogkleuren */
            const zoekOogkleuren = oogkleuren.filter(oogkleur => oogkleur === user.oogkleur);
            if (zoekOogkleuren.length === 0) {
                oogkleuren.push(user.oogkleur);
            }

            /* Zoek alle haarkleuren */
            const zoekHaarkleuren = haarkleuren.filter(haarkleur => haarkleur === user.haarkleur);
            if (zoekHaarkleuren.length === 0) {
                haarkleuren.push(user.haarkleur);
            }

            /* Zoek alle beroepen */
            const zoekBeroepen = beroepen.filter(beroep => beroep === user.beroep);
            if (zoekBeroepen.length === 0) {
                beroepen.push(user.beroep);
            }

            /* Zoek alle sexes */
            const zoekSexes = sexes.filter(sexe => sexe === user.sexe);
            if (zoekSexes.length === 0) {
                sexes.push(user.sexe);
            }

            /* Zoek minimum grootte */
            if (minLengte > Number(user.grootte)) {
                minLengte = Number(user.grootte);
            }

            /* Zoek maximum grootte */
            if (maxLengte < Number(user.grootte)) {
                maxLengte = Number(user.grootte);
            }

            /* Zoek minimum gewicht */
            if (minGewicht > Number(user.gewicht)) {
                minGewicht = Number(user.gewicht);
            }

            /* Zoek maximum gewicht */
            if (maxGewicht < Number(user.gewicht)) {
                maxGewicht = Number(user.gewicht);
            }

            /* Zoek minimum & maximum leeftijd */
            leeftijd = calculate_leeftijd(new Date(user.geboortedatum));

            if (minLeeftijd > leeftijd) {
                minLeeftijd = leeftijd;
            }

            if (maxLeeftijd < leeftijd) {
                maxLeeftijd = leeftijd;
            }
        });

    /* Functie die de leeftijd berekent */
    function calculate_leeftijd(geboorteDatum) {
        let diff_ms = Date.now() - geboorteDatum.getTime();
        let age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }


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

    document.getElementById("minLengte").setAttribute('min', minLengte);
    document.getElementById("minLengte").setAttribute('max', maxLengte);
    document.getElementById("maxLengte").setAttribute('min', minLengte);
    document.getElementById("maxLengte").setAttribute('max', maxLengte);

    document.getElementById("minGewicht").setAttribute('min', minGewicht);
    document.getElementById("minGewicht").setAttribute('max', maxGewicht);
    document.getElementById("maxGewicht").setAttribute('min', minGewicht);
    document.getElementById("maxGewicht").setAttribute('max', maxGewicht);

    document.getElementById("minLeeftijd").setAttribute('min', minLeeftijd);
    document.getElementById("minLeeftijd").setAttribute('max', maxLeeftijd);
    document.getElementById("maxLeeftijd").setAttribute('min', minLeeftijd);
    document.getElementById("maxLeeftijd").setAttribute('max', maxLeeftijd);
};



/*Event handler button "Zoeken". */
document.getElementById("zoeken").onclick = function () {
    if (validateInput()) {
        /* Toon ideale partners. */
        zoekPartners();
    };
};

/* Valideer input van de user. */
function validateInput() {
    /* Retrieve correct and incorrect inputs. */
    const correcteElementen = document.querySelectorAll("input:valid,select:valid");
    const foutieveElementen = document.querySelectorAll("input:invalid,select:invalid");

    /* Show the faulty inputs as red. */
    foutieveElementen.forEach(element => element.classList.add("fout"));
    correcteElementen.forEach(element => element.classList.remove("fout"));

    /* Zet de focus op het eerte foutieve element. Toon foutboodschap. */
    if (foutieveElementen.length !== 0) {
        /* document.getElementById("inputFout").style.display = "inline";  */
        foutieveElementen[0].focus();
        return false;
    } else {
        /* document.getElementById("inputFout").style.display = "none";  */

        if (Number(document.getElementById("minLeeftijd").value) > Number(document.getElementById("maxLeeftijd").value)) {
            document.getElementById("minLeeftijd").focus();
            document.getElementById("minLeeftijd").classList.add("fout");
            document.getElementById("maxLeeftijd").classList.add("fout");
            return false;
        } else {
            document.getElementById("minLeeftijd").classList.remove("fout");
            document.getElementById("maxLeeftijd").classList.remove("fout");
            return true;
        };


    };
};

// DEEL YANNIS 

//function om juiste waarde op te halen

/* document.getElementById('zoeken').addEventListener('click', function (e) { */
function zoekPartners() {
    let geslacht = document.getElementById('sexe').value;
    let oogkleur = document.getElementById('oogkleur').value;
    let haarkleur = document.getElementById('haarkleur').value;
    let beroep = document.getElementById('beroep').value;

    console.log(geslacht, oogkleur, haarkleur, beroep);

    let rangeMinAge = document.getElementById('minLeeftijd').value;
    let rangeMaxAge = document.getElementById('maxLeeftijd').value;

    console.log(rangeMinAge, rangeMaxAge); //test

    /*let rangeMinGeboortedatum = document.getElementById('input11_1').value;
    let rangeMaxGeboortedatum = document.getElementById('input11_2').value;*/

    let rangeMinGewicht = document.getElementById('minGewicht').value;
    let rangeMaxGewicht = document.getElementById('maxGewicht').value;
    let rangeMinGrootte = document.getElementById('minLengte').value;
    let rangeMaxGrootte = document.getElementById('maxLengte').value;

    let url = "https://scrumserver.tenobe.org/scrum/api" + '/profiel/search.php/'
    url += '?sexe=' + geslacht + '&oogkleur=' + oogkleur + '&haarkleur=' + haarkleur + '&beroep=' + beroep;
    /*url += '&geboortedatumOperator=range&rangeMinGeboortedatum=' + rangeMinGeboortedatum + '&rangeMaxGeboortedatum=' + rangeMaxGeboortedatum;*/
    url += '&gewichtOperator=range&rangeMinGewicht=' + rangeMinGewicht + '&rangeMaxGewicht=' + rangeMaxGewicht;
    url += '&grootteOperator=range&rangeMinGrootte=' + rangeMinGrootte + '&rangeMaxGrootte=' + rangeMaxGrootte;


    //LET OP : rooturl = https://scrumserver.tenobe.org/scrum/api
    fetch(url)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.log(error);
        });
};

// EINDE DEEL YANNIS