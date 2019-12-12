"use strict"

//global variables 
let haarkleuren = [
    "blond", "asblond", "goudblond", "donkerblond", "zwart",
    "blauwzwart", "bruin", "asbruin", "kastanjebruin",
    "koelbruin", "asbruin", "chocoladebruin", "natuurlijk bruin", "goudbruin",
    "amber", "koper", "auberginerood", "roodbruin", "bordeaux rood", "grijs"
];


let oogkleuren = [
    "blauw", "groen", "bruin", "hazelnoot", "grijs", "groen-grijs", "grijsgroen", "amber",
];

const haarkleurId = document.getElementById("haarkleur");
const OogkleurId = document.getElementById("oogkleur");

//function fill dropdowns
function initialisation() {

    for (let teller = 0; teller < haarkleuren.length; teller++) {
        let nieuweHaarkleur = document.createElement("option");
        nieuweHaarkleur.text = haarkleuren[teller];
        haarkleurId.add(nieuweHaarkleur);
    };

    for (let teller = 0; teller < oogkleuren.length; teller++) {
        let nieuweOogkleur = document.createElement("option");
        nieuweOogkleur.text = oogkleuren[teller];
        haarkleurId.add(nieuweOogkleur);
    };
};






initialisation();

document.getElementById("submit").onclick = submit;