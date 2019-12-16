"use strict"

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
//             if (sessionStorage.getItem("wachtwoord") === encryptedWachtwoord) {
//                 window.location.href = "../Website/main.html";
//             }
//         }
//     }
// }
/////////

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
let rooturl = "https://scrumserver.tenobe.org/scrum/api";


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
        OogkleurId.add(nieuweOogkleur);
    };
};
//global variables
let naam = "";
let afbeelding = "";
let selectedfile = "";

//function submit 
function submit() {
    let sexe = "";
    let fotonaam = "";
    let familienaam = document.getElementById("familienaam").value;
    let voornaam = document.getElementById("voornaam").value;

    let nickname = document.getElementById("nickname").value;

    let geboortedatum = document.getElementById("geboortedatum").value;
    let email = document.getElementById("email").value;
    if (document.getElementById("foto").files.length > 0)
    {
        selectedfile = document.getElementById("foto").files;
        fotonaam = selectedfile[0].name;
    } 
    let beroep = document.getElementById("beroep").value;

    for (const f of document.getElementsByName("geslacht")) {
        if (f.checked)
            sexe = f.value;
    }

    let haarkleur = document.getElementById("haarkleur");
    let oogkleur = document.getElementById("oogkleur");
    let selectedHaarkleur = haarkleur.options[haarkleur.selectedIndex].innerText;
    let selectedoogkleur = oogkleur.options[oogkleur.selectedIndex].innerText;
    let grootte = document.getElementById("grootte").value;
    let gewicht = document.getElementById("gewicht").value;
    let wachtwoord = document.getElementById("wachtwoord").value;
    let check = document.getElementById("check").value;
    let lovecoins = 0;

    if (familienaam === "" || voornaam === "" || nickname === "" || geboortedatum === "" ||
        email === "" || fotonaam === "" || beroep === "" || sexe === "" ||
        grootte === "" || gewicht === "" || wachtwoord === "") {
        window.alert(" Gelieve alle velden in te vullen! ");
    } else {
        if (wachtwoord !== check)
            window.alert("Wachtwoord en Check wachtwoord moeten gelijk zijn");
        else {
            let data = ({
                familienaam: familienaam,
                voornaam: voornaam,
                geboortedatum: geboortedatum,
                email: email,
                nickname: nickname,
                foto: fotonaam,
                beroep: beroep,
                sexe: sexe,
                haarkleur: selectedHaarkleur,
                oogkleur: selectedoogkleur,
                grootte: grootte,
                gewicht: gewicht,
                wachtwoord: wachtwoord,
                lovecoins: lovecoins
            });

            console.log(data);

            let url = rooturl + '/profiel/create.php';
            var request = new Request(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });
            fetch(request)
                .then(function (resp) { 
                    if (resp.ok)
                    {
                        //upload een foto enkel als aanmaken van profiel is gelukt
                        uploadFoto();
                        //console.log("foto upload");
                    resp.json()
                        .then(function (data) { console.log(data);
                        window.alert("Gebruiker aangemaakt!");
                        //na profiel creeren, de gebruiker moet aanmelden
                        window.location.href = "index.html";
                    })
                        
                 } else
                 {
                    resp.json().then(function (data){console.log("error profiel aanmaken")}).catch(function (error) { console.log(error); });
                 }
        });
}
}
}


initialisation();

//genereert base64 code van de gekozen foto
document.getElementById("foto").onchange = function base64Foto ()
        {
        let imageFile = this.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            let srcData = fileLoadedEvent.target.result;
            let newImage = document.createElement('img');
            newImage.src = srcData;
            document.getElementById("dummy").innerHTML = newImage.outerHTML;
            document.getElementById("txt").value = document.getElementById("dummy").innerHTML;
            afbeelding = document.getElementById("txt").value;
            //console.log("afbeelding in function filereader.onload", afbeelding);
                                                        }
        fileReader.readAsDataURL(imageFile);
        naam = this.files[0].name;
        //console.log("img name: ",naam);
        }

document.getElementById("submit").onclick = submit;

//upload foto
function uploadFoto()
{
   
        let url = 'https://scrumserver.tenobe.org/scrum/api/image/upload.php';
    
        let dataFoto = {
            naam: naam,
            afbeelding: afbeelding
        }
        //console.log("dataFoto: ", dataFoto);
        let request = new Request(url, {
            method: 'POST',
            body: JSON.stringify(dataFoto),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
 
    
        fetch(request)
            .then(function (resp) { return resp.json(); })
            .then(function (data) {
                console.log('     ==> OK (Foto te vinden op url = ' + data.fileURL + ')');
                console.log('     • Foto inladen in IMG');
                //document.getElementById('uploadResult').src = data.fileURL;
                console.log('     ==> OK');
                console.log('==> Klaar');
            })
            .catch(function (error) { console.log(error); })
   
}
