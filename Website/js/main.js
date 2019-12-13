"use strict";

////////Login nakijken
let loginUrl = 'https://scrumserver.tenobe.org/scrum/api/profiel/read.php?';
fetch(loginUrl)
    .then(function (response){return response.json();})
    .then(loginCheck)
    .catch(function (error){console.log(error);});

function loginCheck (data){
    for (let el of data) {
        if (sessionStorage.getItem("userId") === el.id) {
            let wachtwoord = el.wachtwoord;
            let encryptedWachtwoord = CryptoJS.SHA256(wachtwoord).toString();
            if (sessionStorage.getItem("wachtwoord") !== encryptedWachtwoord) {
                window.location.href = "../Website/index.html";
            }
        }
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
    let allesOK = true;
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
        allesOK = false;
    } else {
        /* document.getElementById("inputFout").style.display = "none";  */
        if ((document.getElementById("minLeeftijd").value !== "" && document.getElementById("maxLeeftijd").value !== "") &&
            (Number(document.getElementById("minLeeftijd").value) > Number(document.getElementById("maxLeeftijd").value))) {
            document.getElementById("minLeeftijd").focus();
            document.getElementById("minLeeftijd").classList.add("fout");
            document.getElementById("maxLeeftijd").classList.add("fout");
            allesOK = false;
        } else {
            document.getElementById("minLeeftijd").classList.remove("fout");
            document.getElementById("maxLeeftijd").classList.remove("fout");
        };

        if ((document.getElementById("minGewicht").value !== "" && document.getElementById("maxGewicht").value !== "") &&
            (Number(document.getElementById("minGewicht").value) > Number(document.getElementById("maxGewicht").value))) {
            document.getElementById("minGewicht").focus();
            document.getElementById("minGewicht").classList.add("fout");
            document.getElementById("maxGewicht").classList.add("fout");
            allesOK = false;
        } else {
            document.getElementById("minGewicht").classList.remove("fout");
            document.getElementById("maxGewicht").classList.remove("fout");
        };

        if ((document.getElementById("minLengte").value !== "" && document.getElementById("maxLengte").value !== "") &&
            (Number(document.getElementById("minLengte").value) > Number(document.getElementById("maxLengte").value))) {
            document.getElementById("minLengte").focus();
            document.getElementById("minLengte").classList.add("fout");
            document.getElementById("maxLengte").classList.add("fout");
            allesOK = false;
        } else {
            document.getElementById("minLengte").classList.remove("fout");
            document.getElementById("maxLengte").classList.remove("fout");
        };

        return allesOK;
    };
};

/* Bereken datum in functie van leeftijd */
function createDateLeeftijd(days, months, years) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    date.setMonth(date.getMonth() + months);
    date.setFullYear(date.getFullYear() + years);
    return date;
}

// DEEL YANNIS 

//function om juiste waarde op te halen

/* document.getElementById('zoeken').addEventListener('click', function (e) { */
function zoekPartners() {
    let geslacht = document.getElementById('sexe').value;
    let oogkleur = document.getElementById('oogkleur').value;
    let haarkleur = document.getElementById('haarkleur').value;
    let beroep = document.getElementById('beroep').value;

    console.log(geslacht, oogkleur, haarkleur, beroep);

    let rangeMinGeboortedatum = "";
    let rangeMaxGeboortedatum = "";
    let rangeMaxGeboortedatumYYYYMMDD = "";
    let rangeMinGeboortedatumYYYYMMDD = "";
    let urlGeboortedatumSubstring = "";

    if (document.getElementById("minLeeftijd").value !== "") {
        rangeMaxGeboortedatum = createDateLeeftijd(0, 0, -Number(document.getElementById("minLeeftijd").value));
        rangeMaxGeboortedatumYYYYMMDD = `${rangeMaxGeboortedatum.getFullYear()}-${(rangeMaxGeboortedatum.getMonth()+1)}-${rangeMaxGeboortedatum.getDate()}`;
    };

    if (document.getElementById("maxLeeftijd").value !== "") {
        rangeMinGeboortedatum = createDateLeeftijd(1, 0, -(Number(document.getElementById("maxLeeftijd").value) + 1));
        rangeMinGeboortedatumYYYYMMDD = `${rangeMinGeboortedatum.getFullYear()}-${(rangeMinGeboortedatum.getMonth()+1)}-${rangeMinGeboortedatum.getDate()}`;
    };

    if ((document.getElementById("minLeeftijd").value !== "") && (document.getElementById("maxLeeftijd").value !== "")) {
        urlGeboortedatumSubstring = '&geboortedatumOperator=range&rangeMinGeboortedatum=' + rangeMinGeboortedatumYYYYMMDD + '&rangeMaxGeboortedatum=' + rangeMaxGeboortedatumYYYYMMDD;
    };

    if ((document.getElementById("minLeeftijd").value !== "") && (document.getElementById("maxLeeftijd").value === "")) {
        urlGeboortedatumSubstring = '&geboortedatumOperator=st&geboortedatum=' + rangeMaxGeboortedatumYYYYMMDD;
    };

    if ((document.getElementById("minLeeftijd").value === "") && (document.getElementById("maxLeeftijd").value !== "")) {
        urlGeboortedatumSubstring = '&geboortedatumOperator=gt&geboortedatum=' + rangeMinGeboortedatumYYYYMMDD;
    };

    /* console.log("Min GeboorteDatum (max leeftijd)", rangeMinGeboortedatum);  */
    /* console.log("Max GeboorteDatum (min leeftijd)", rangeMaxGeboortedatum);  */
    console.log(urlGeboortedatumSubstring);

    /*let rangeMinGeboortedatum = document.getElementById('input11_1').value;
    let rangeMaxGeboortedatum = document.getElementById('input11_2').value;*/

    let rangeMinGewicht = document.getElementById('minGewicht').value;
    let rangeMaxGewicht = document.getElementById('maxGewicht').value;
    let rangeMinGrootte = document.getElementById('minLengte').value;
    let rangeMaxGrootte = document.getElementById('maxLengte').value;

    let url = "https://scrumserver.tenobe.org/scrum/api" + '/profiel/search.php/'
    url += '?sexe=' + geslacht + '&oogkleur=' + oogkleur + '&haarkleur=' + haarkleur + '&beroep=' + beroep;
    url += urlGeboortedatumSubstring;
    url += '&gewichtOperator=range&rangeMinGewicht=' + rangeMinGewicht + '&rangeMaxGewicht=' + rangeMaxGewicht;
    url += '&grootteOperator=range&rangeMinGrootte=' + rangeMinGrootte + '&rangeMaxGrootte=' + rangeMaxGrootte;

    //LET OP : rooturl = https://scrumserver.tenobe.org/scrum/api
    fetch(url)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            console.log(data);
            GebruikersGegevens(data)

        })
        .catch(function (error) {
            clearBox("matches");
            console.log(error);
        });
};

function GebruikersGegevens(data) {

    clearBox("matches"); //functie die de bestaande innerHTML van een element met ID wist

    //table aanmaken
    const tableResults = document.createElement("table");
    tableResults.id = "tableResults";
    tableResults.style.width = "100%";
    const container = document.getElementById("matches");
    container.appendChild(tableResults);

    //table opvullen
    //hoofding

    const tableRowHead = tableResults.insertRow(); //dit zou table header moeten zijn
    const sterrenbeeldCell = tableRowHead.insertCell();
    sterrenbeeldCell.outerHTML = "<th>Sterrenbeeld</th>";
    const nicknameCell = tableRowHead.insertCell();
    nicknameCell.outerHTML = "<th>Nickname</th>";
    /*const fotoCell = tableRowHead.insertCell();
    fotoCell.outerHTML = "<th>Foto</th>";
    const idCell = tableRowHead.insertCell();
    idCell.outerHTML = "<th>ID</th>";
    const voornaamCell = tableRowHead.insertCell();
    voornaamCell.outerHTML = "<th>Voornaam</th>";
    const familienaamCell = tableRowHead.insertCell();
    familienaamCell.outerHTML = "<th>Familienaam</th>";
    const geboorteCell = tableRowHead.insertCell();
    geboorteCell.outerHTML = "<th>Geboortedatum</th>";
    const emailCell= tableRowHead.insertCell();
    emailCell.outerHTML = "<th>E-mail</th>";*/
    const beroepCell = tableRowHead.insertCell();
    beroepCell.outerHTML = "<th>Beroep</th>";
    const sexeCell = tableRowHead.insertCell();
    sexeCell.outerHTML = "<th>Sexe</th>";
    const haarkleurCell = tableRowHead.insertCell();
    haarkleurCell.outerHTML = "<th>Haarkleur</th>";
    const oogkleurCell = tableRowHead.insertCell();
    oogkleurCell.outerHTML = "<th>Oogkleur</th>";
    const grootteCell = tableRowHead.insertCell();
    grootteCell.outerHTML = "<th>Lengte (cm)</th>";
    const gewichtCell = tableRowHead.insertCell();
    gewichtCell.outerHTML = "<th>Gewicht (kg)</th>";

    //body

    for (const el of data) {

        const tableRowBody = tableResults.insertRow();

        const sterrenbeeldCell = tableRowBody.insertCell();
        sterrenbeeldCell.innerHTML = getZodiacSign(el.geboortedatum);

        const nicknameCell = tableRowBody.insertCell();
        nicknameCell.innerText = el.nickname;

        /*const fotoCell = tableRowBody.insertCell();           //`<img src="${fotoPlusEffect}">`
        fotoCell.innerHTML = el.foto;

        const idCell = tableRowBody.insertCell();
        idCell.innerText = el.id;

        const voornaamCell = tableRowBody.insertCell();
        voornaamCell.innerText = el.voornaam;                              

        const familienaamCell = tableRowBody.insertCell();
        familienaamCell.innerText = el.familienaam;

        const geboorteCell = tableRowBody.insertCell();
        geboorteCell.innerText = el.geboortedatum;

        const emailCell = tableRowBody.insertCell();
        emailCell.innerText = el.email;*/

        const beroepCell = tableRowBody.insertCell();
        beroepCell.innerText = el.beroep;

        const sexeCell = tableRowBody.insertCell();
        sexeCell.innerText = el.sexe;

        const haarkleurCell = tableRowBody.insertCell();
        haarkleurCell.innerText = el.haarkleur;

        const oogkleurCell = tableRowBody.insertCell();
        oogkleurCell.innerText = el.oogkleur;

        const grootteCell = tableRowBody.insertCell();
        grootteCell.innerText = el.grootte;

        const gewichtCell = tableRowBody.insertCell();
        gewichtCell.innerText = el.gewicht;

    }

    function clearBox(elementId){
        document.getElementById(elementId).innerHTML = "";
    }
}
// EINDE DEEL YANNIS




function getZodiacSign(date) {

    const day = date.slice(8,10);
    const month = date.slice(5,7);

    // date uitsplitsen in day en month
  
    if((month == 1 && day <= 20) || (month == 12 && day >=22)) {
      return "Steenbok";
    } else if ((month == 1 && day >= 21) || (month == 2 && day <= 19)) {
      return "Waterman";
    } else if((month == 2 && day >= 20) || (month == 3 && day <= 20)) {
      return "Vis";
    } else if((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
      return "Ram";
    } else if((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
      return "Stier";
    } else if((month == 5 && day >= 21) || (month == 6 && day <= 21)) {
      return "Tweeling";
    } else if((month == 6 && day >= 22) || (month == 7 && day <= 23)) {
      return "Kreeft";
    } else if((month == 7 && day >= 24) || (month == 8 && day <= 23)) {
      return "Leeuw";
    } else if((month == 8 && day >= 24) || (month == 9 && day <= 22)) {
      return "Maagd";
    } else if((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
      return "Weegschaal";
    } else if((month == 10 && day >= 23) || (month == 11 && day <= 22)) {
      return "Schorpioen";
    } else if((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
      return "Boogschutter";
    }
  }