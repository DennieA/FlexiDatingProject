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
            const zoekOogkleuren = oogkleuren.filter(oogkleur => oogkleur === capitalizeFirstCharacter(user.oogkleur));
            if (zoekOogkleuren.length === 0) {
                oogkleuren.push(capitalizeFirstCharacter(user.oogkleur));
            }

            /* Zoek alle haarkleuren */
            const zoekHaarkleuren = haarkleuren.filter(haarkleur => haarkleur === capitalizeFirstCharacter(user.haarkleur));
            if (zoekHaarkleuren.length === 0) {
                haarkleuren.push(capitalizeFirstCharacter(user.haarkleur));
            }

            /* Zoek alle beroepen */
            const zoekBeroepen = beroepen.filter(beroep => beroep === capitalizeFirstCharacter(user.beroep));
            if (zoekBeroepen.length === 0) {
                beroepen.push(capitalizeFirstCharacter(user.beroep));
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

    /* Vul de comboBox met de oogkleur items/options gesorteerd. */
    oogkleuren.sort()
        .forEach(
            oogkleur => {
                const comboBoxItem = document.createElement("option");
                comboBoxItem.innerText = oogkleur;
                comboBoxItem.value = oogkleur;
                /* Add comboBox item to the comboBox. */
                document.getElementById("oogkleur").appendChild(comboBoxItem);
            }
        )

    /* Vul de comboBox met de haarkleur items/options gesorteerd. */
    haarkleuren.sort()
        .forEach(
            haarkleur => {
                const comboBoxItem = document.createElement("option");
                comboBoxItem.innerText = haarkleur;
                comboBoxItem.value = haarkleur;
                /* Add comboBox item to the comboBox. */
                document.getElementById("haarkleur").appendChild(comboBoxItem);
            }
        )

    /* Vul de comboBox met de beroep items/options gesorteerd. */
    beroepen.sort()
        .forEach(
            beroep => {
                const comboBoxItem = document.createElement("option");
                comboBoxItem.innerText = beroep;
                comboBoxItem.value = beroep;
                /* Add comboBox item to the comboBox. */
                document.getElementById("beroep").appendChild(comboBoxItem);
            }
        )

    /* Vul de comboBox met de sexe items/options. */
    sexes.sort()
        .forEach(
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



/* Event handler button "Zoeken". */
document.getElementById("zoeken").onclick = function () {
    if (validateInput()) {
        /* Toon ideale partners. */
        zoekPartners();
    };
};

/* Event handler button "Feel lucky". */
document.getElementById("lucky").onclick = function () {
    if (validateInput()) {
        /* Toon één ideale partner. */
        lucky();
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

/* Haal een array van resultaten op adhv de juiste zoekwaarden */
function zoekPartners() {
    let url = alleResultaten();

    fetch(url)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            clearBox("matches");
            /* console.log(data); */
            GebruikersGegevens(data)
        })
        .catch(function (error) {
            clearBox("matches");
            console.log(error);
        });
};

/* Haal een enkel willekeurige resultaat op adhv de juiste zoekwaarden */
function lucky() {
    let url = alleResultaten();

    fetch(url)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            clearBox("matches")
            let luckyResult = data[Math.floor(Math.random() * data.length)];

            /* Table aanmaken */
            const tableResults = document.createElement("table");
            /* Table head aanmaken */
            const tableHead = tableResults.createTHead();
            tableResults.id = "tableResults";
            tableResults.style.width = "100%";
            /* Haal de plaats op waar de tabel moet komen */
            const container = document.getElementById("matches");
            /* Table op de html pagina zetten in zijn container */
            container.appendChild(tableResults);

            /* Table head opvullen */
            const tableRowHead = tableHead.insertRow();
            let sterrenbeeldCell = tableRowHead.insertCell();
            sterrenbeeldCell.outerHTML = '<th>Sterrenbeeld</th>';
            let nicknameCell = tableRowHead.insertCell();
            nicknameCell.outerHTML = '<th>Nickname</th>';
            let beroepCell = tableRowHead.insertCell();
            beroepCell.outerHTML = '<th>Beroep</th>';
            let sexeCell = tableRowHead.insertCell();
            sexeCell.outerHTML = '<th>Sexe</th>';
            let haarkleurCell = tableRowHead.insertCell();
            haarkleurCell.outerHTML = '<th>Haarkleur</th>';
            let oogkleurCell = tableRowHead.insertCell();
            oogkleurCell.outerHTML = '<th>Oogkleur</th>';
            let grootteCell = tableRowHead.insertCell();
            grootteCell.outerHTML = '<th>Lengte (cm)</th>';
            let gewichtCell = tableRowHead.insertCell();
            gewichtCell.outerHTML = '<th>Gewicht (kg)</th>';

            const tableRowBody = tableResults.insertRow();
            sterrenbeeldCell = tableRowBody.insertCell();
            sterrenbeeldCell.innerHTML = `<img src="images/icons/${getZodiacSign(luckyResult.geboortedatum)}.png" title = ${getZodiacSign(luckyResult.geboortedatum).slice(3)}>`;

            nicknameCell = tableRowBody.insertCell();
            nicknameCell.innerHTML = `<a href = "#" onclick='passNickname("${luckyResult.nickname}")'>${luckyResult.nickname}</a>`;
            beroepCell = tableRowBody.insertCell();
            beroepCell.innerText = luckyResult.beroep;
            sexeCell = tableRowBody.insertCell();
            sexeCell.innerText = luckyResult.sexe;
            haarkleurCell = tableRowBody.insertCell();
            haarkleurCell.innerText = luckyResult.haarkleur;
            oogkleurCell = tableRowBody.insertCell();
            oogkleurCell.innerText = luckyResult.oogkleur;
            grootteCell = tableRowBody.insertCell();
            grootteCell.innerText = luckyResult.grootte;
            gewichtCell = tableRowBody.insertCell();
            gewichtCell.innerText = luckyResult.gewicht;
        })
        .catch(function (error) {
            clearBox("matches");
            console.log(error);
        });
};

/* Functie die de zoekcriteria ophaalt en de input voor de API search call samenstelt */
function alleResultaten() {
    let geslacht = document.getElementById('sexe').value;
    let oogkleur = document.getElementById('oogkleur').value;
    let haarkleur = document.getElementById('haarkleur').value;
    let beroep = document.getElementById('beroep').value;

    let rangeMinGeboortedatum = "";
    let rangeMaxGeboortedatum = "";
    let rangeMaxGeboortedatumYYYYMMDD = "";
    let rangeMinGeboortedatumYYYYMMDD = "";
    let urlGeboortedatumSubstring = "";
    let urlGewichtSubstring = "";
    let urlGrootteSubstring = "";

    /* Supply search API met interface parameters voor leeftijd */
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
        urlGeboortedatumSubstring = '&geboortedatumOperator=steq&geboortedatum=' + rangeMaxGeboortedatumYYYYMMDD;
    };

    if ((document.getElementById("minLeeftijd").value === "") && (document.getElementById("maxLeeftijd").value !== "")) {
        urlGeboortedatumSubstring = '&geboortedatumOperator=gteq&geboortedatum=' + rangeMinGeboortedatumYYYYMMDD;
    };

    /* Supply search API met interface parameters voor gewicht */
    let rangeMinGewicht = document.getElementById('minGewicht').value;
    let rangeMaxGewicht = document.getElementById('maxGewicht').value;

    if ((document.getElementById("minGewicht").value !== "") && (document.getElementById("maxGewicht").value !== "")) {
        urlGewichtSubstring = '&gewichtOperator=range&rangeMinGewicht=' + rangeMinGewicht + '&rangeMaxGewicht=' + rangeMaxGewicht;
    };

    if ((document.getElementById("minGewicht").value !== "") && (document.getElementById("maxGewicht").value === "")) {
        urlGewichtSubstring = '&gewichtOperator=gteq&gewicht=' + rangeMinGewicht;
    };

    if ((document.getElementById("minGewicht").value === "") && (document.getElementById("maxGewicht").value !== "")) {
        urlGewichtSubstring = '&gewichtOperator=steq&gewicht=' + rangeMaxGewicht;
    };

    /* Supply search API met interface parameters voor grootte */
    let rangeMinGrootte = document.getElementById('minLengte').value;
    let rangeMaxGrootte = document.getElementById('maxLengte').value;

    if ((document.getElementById("minLengte").value !== "") && (document.getElementById("maxLengte").value !== "")) {
        urlGrootteSubstring = '&grootteOperator=range&rangeMinGrootte=' + rangeMinGrootte + '&rangeMaxGrootte=' + rangeMaxGrootte;
    };

    if ((document.getElementById("minLengte").value !== "") && (document.getElementById("maxLengte").value === "")) {
        urlGrootteSubstring = '&grootteOperator=gteq&grootte=' + rangeMinGrootte;
    };

    if ((document.getElementById("minLengte").value === "") && (document.getElementById("maxLengte").value !== "")) {
        urlGrootteSubstring = '&grootteOperator=steq&grootte=' + rangeMaxGrootte;
    };

    let url = "https://scrumserver.tenobe.org/scrum/api" + '/profiel/search.php/'
    url += '?sexe=' + geslacht + '&oogkleur=' + oogkleur + '&haarkleur=' + haarkleur + '&beroep=' + beroep;
    url += urlGeboortedatumSubstring;
    url += urlGewichtSubstring;
    url += urlGrootteSubstring;
    return url;
}

/* Functie om de resultaten tabel op te vullen */
function GebruikersGegevens(data) {
    /* Table aanmaken */
    const tableResults = document.createElement("table");
    /* Table head aanmaken */
    const tableHead = tableResults.createTHead();
    tableResults.id = "tableResults";
    tableResults.style.width = "100%";
    /* Haal de plaats op waar de tabel moet komen */
    const container = document.getElementById("matches");
    /* Table op de html pagina zetten in zijn container */
    container.appendChild(tableResults);

    /* Table head opvullen */
    const tableRowHead = tableHead.insertRow();
    const sterrenbeeldCell = tableRowHead.insertCell();
    sterrenbeeldCell.outerHTML = '<th class = "klikbaar">Sterrenbeeld</th>';
    const nicknameCell = tableRowHead.insertCell();
    nicknameCell.outerHTML = '<th class = "klikbaar">Nickname</th>';
    const beroepCell = tableRowHead.insertCell();
    beroepCell.outerHTML = '<th class = "klikbaar">Beroep</th>';
    const sexeCell = tableRowHead.insertCell();
    sexeCell.outerHTML = '<th class = "klikbaar">Sexe</th>';
    const haarkleurCell = tableRowHead.insertCell();
    haarkleurCell.outerHTML = '<th class = "klikbaar">Haarkleur</th>';
    const oogkleurCell = tableRowHead.insertCell();
    oogkleurCell.outerHTML = '<th class = "klikbaar">Oogkleur</th>';
    const grootteCell = tableRowHead.insertCell();
    grootteCell.outerHTML = '<th class = "klikbaar">Lengte (cm)</th>';
    const gewichtCell = tableRowHead.insertCell();
    gewichtCell.outerHTML = '<th class = "klikbaar">Gewicht (kg)</th>';

    /* Table body opvullen */
    const tableBody = document.createElement("tbody");

    for (const el of data) {
        const tableRowBody = tableBody.insertRow();

        const sterrenbeeldCell = tableRowBody.insertCell();
        sterrenbeeldCell.innerHTML = `<img src="images/icons/${getZodiacSign(el.geboortedatum)}.png" title = ${getZodiacSign(el.geboortedatum).slice(3)}>`;

        const nicknameCell = tableRowBody.insertCell();
        nicknameCell.innerHTML = `<a href = "#" onclick='passNickname("${el.nickname}")'>${el.nickname}</a>`;
        nicknameCell.id = el.id;

        const beroepCell = tableRowBody.insertCell();
        beroepCell.innerText = capitalizeFirstCharacter(el.beroep);

        const sexeCell = tableRowBody.insertCell();
        sexeCell.innerText = el.sexe;

        const haarkleurCell = tableRowBody.insertCell();
        haarkleurCell.innerText = capitalizeFirstCharacter(el.haarkleur);

        const oogkleurCell = tableRowBody.insertCell();
        oogkleurCell.innerText = capitalizeFirstCharacter(el.oogkleur);

        const grootteCell = tableRowBody.insertCell();
        grootteCell.innerText = el.grootte;

        const gewichtCell = tableRowBody.insertCell();
        gewichtCell.innerText = el.gewicht;
    }

    /* Table head en table body in de eigenlijke tabel zetetn */
    tableResults.appendChild(tableHead);
    tableResults.appendChild(tableBody);


    /* Event handlers koppelen aan de table headers */
    /* Get all the table header elements */
    tableResults.querySelectorAll("th")
        /* Add a click handler for each header element  */
        .forEach((element, columnNo) => {
            element.addEventListener("click", event => {
                /* Call a function which sorts the table by a given column number */
                sortTable(tableResults, columnNo);
            })
        })
}

/* Function om de tabel te sorteren */
function sortTable(table, sortColumn) {
    /* Get the data from the table cells */
    const tableBody = table.querySelector('tbody')
    const tableData = table2data(tableBody);
    /* Sort the extracted data */
    tableData.sort((a, b) => {
        if (a[sortColumn] > b[sortColumn]) {
            return 1;
        }
        return -1;
    })
    /* Put the sorted data back into the table */
    data2table(tableBody, tableData);
}

/* Functie om de HTML tabel over te zetten naar een lokale tabel */
function table2data(tableBody) {
    /* Create the array that'll hold the data rows */
    const tableData = [];
    tableBody.querySelectorAll('tr')
        /* For each table row... */
        .forEach(row => {
            const rowData = [];
            /* For each cell in that row */
            row.querySelectorAll('td')
                .forEach(cell => {
                    /* In order to sort correctly string and numbers */
                    if (isNaN(cell.innerHTML)) {
                        /* Copy clear text */
                        rowData.push(cell.innerHTML);
                    } else {
                        /* Convert string into number */
                        rowData.push(Number(cell.innerHTML));
                    };
                })
            /* Add the full row to the table data  */
            tableData.push(rowData);
        });
    return tableData;
}

/* Functie om de lokale (gesorteerde) tabel terug te zetten */
function data2table(tableBody, tableData) {
    tableBody.querySelectorAll('tr')
        /* For each table row...  */
        .forEach((row, i) => {
            /* Get the array for the row data */
            const rowData = tableData[i];
            row.querySelectorAll('td')
                /* For each table cell ... */
                .forEach((cell, j) => {
                    cell.innerHTML = rowData[j];
                })
        });
}

/* Maak de html binnen een element leeg */
function clearBox(elementId) {
    document.getElementById(elementId).innerHTML = "";
}

/* bepaal het sterrenbeeld */
function getZodiacSign(date) {
    const day = date.slice(8, 10);
    const month = date.slice(5, 7);
    if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
        return "01_Steenbok";
    } else if ((month == 1 && day >= 21) || (month == 2 && day <= 19)) {
        return "02_Waterman";
    } else if ((month == 2 && day >= 20) || (month == 3 && day <= 20)) {
        return "03_Vis";
    } else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
        return "04_Ram";
    } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
        return "05_Stier";
    } else if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) {
        return "06_Tweeling";
    } else if ((month == 6 && day >= 22) || (month == 7 && day <= 23)) {
        return "07_Kreeft";
    } else if ((month == 7 && day >= 24) || (month == 8 && day <= 23)) {
        return "08_Leeuw";
    } else if ((month == 8 && day >= 24) || (month == 9 && day <= 22)) {
        return "09_Maagd";
    } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
        return "10_Weegschaal";
    } else if ((month == 10 && day >= 23) || (month == 11 && day <= 22)) {
        return "11_Schorpioen";
    } else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
        return "12_Boogschutter";
    }
}

/* Functie om de nickname door te geven */
function passNickname(nickname) {
    sessionStorage.setItem("selectedNickname", nickname);
    window.open("matchProfile.html", "_self");
}

/* Functie die strings omvormt naar lowercase met eerste character een hoofdletter. */
function capitalizeFirstCharacter(stringToConvert) {
    return stringToConvert.charAt(0).toUpperCase() + stringToConvert.slice(1).toLowerCase();
};