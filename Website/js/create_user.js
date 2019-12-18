"use strict"

////////Login nakijken
let loginUrl = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + parseInt(sessionStorage.getItem("userId"));
fetch(loginUrl)
    .then(function (response){return response.json();})
    .then(loginCheck)
    .catch(function (error){//console.log(error);
    });

function loginCheck (data){
    let wachtwoord = data.wachtwoord;
    let encryptedWachtwoord = CryptoJS.SHA256(wachtwoord).toString();
    if (sessionStorage.getItem("wachtwoord") === encryptedWachtwoord) {
        window.location.href = "../Website/main.html";
    }
}
/////////

//global variables 
let haarkleuren = [
    "blond", "asblond", "goudblond", "donkerblond", "zwart",
    "blauwzwart", "bruin", "asbruin", "kastanjebruin",
    "koelbruin", "chocoladebruin", "natuurlijk bruin", "goudbruin",
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
        nieuweHaarkleur.value = teller;
        haarkleurId.add(nieuweHaarkleur);
    };

    for (let teller = 0; teller < oogkleuren.length; teller++) {
        let nieuweOogkleur = document.createElement("option");
        nieuweOogkleur.text = oogkleuren[teller];
        nieuweOogkleur.value = teller; 
        OogkleurId.add(nieuweOogkleur);
    };
};
//global variables
let naam = "";
let afbeelding = "";
let selectedfile = "";
let finalFotoNaam;
let naamWeb;
let finalWebcamFotoNaam;
let finalFotoUrl;
let nickname;
let f = false;
let w = false;

for (const typefoto of document.getElementsByName("fotos"))
{ 
    typefoto.onchange = function ()
{
if (this.value === "file")
{   f = true;
    w = false;
    //console.log("file is checked");
    document.getElementById("lokaalFoto").style.display = "block";
    document.getElementById("webcamFoto").style.display = "none";   
} else {
    if (this.value === "cam")
    {   w = true;
        f = false;
        //console.log("webcam is checked");
        document.getElementById("webcamFoto").style.display = "block";
        document.getElementById("lokaalFoto").style.display = "none";  
        
        //video en webcam
    //console.log('Maak verbinding met de webcam');
    let video = document.getElementById('video');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
            });
    }
    //console.log('==> OK');


    //console.log('Zet alles klaar om een foto te kunnen nemen');
    // Elements for taking the snapshot
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    video = document.getElementById('video');
    //console.log('==> OK');


document.getElementById("snap").addEventListener("click", function () {
        //console.log('Er werd een foto genomen.');
        context.drawImage(video, 0, 0, 500, 375);
        let kwaliteit = document.getElementById('kwaliteit').value / 100;            
        //console.log('     • Kwaliteit staat ingesteld op ' + kwaliteit * 100 + "%");
        uploadPicture(canvas.toDataURL('image/jpeg', kwaliteit));
    });
    }}
}}
initialisation();
document.getElementById("submit").onclick = submit;


//function submit 
function submit() {
    let sexe = "";
    let fotonaam = "";
    let familienaam = document.getElementById("familienaam").value;
    let voornaam = document.getElementById("voornaam").value;

    nickname = document.getElementById("nickname").value;

    let geboortedatum = document.getElementById("geboortedatum").value;

    let leeftijd = calculate_leeftijd(new Date(geboortedatum));

    function calculate_leeftijd(geboorteDatum) {
        let diff_ms = Date.now() - geboorteDatum.getTime();
        let age_dt = new Date(diff_ms);

        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    //console.log(leeftijd);


    let email = document.getElementById("email").value;
    
    if (f)
        if (document.getElementById("foto").files.length > 0) {
        selectedfile = document.getElementById("foto").files;
        fotonaam = selectedfile[0].name;
        } 
    if (w)
        if (finalWebcamFotoNaam !== "")
        fotonaam = finalWebcamFotoNaam;
    //console.log("bestand naam: ", fotonaam);
    let beroep = document.getElementById("beroep").value;

    for (const f of document.getElementsByName("geslacht")) {
        if (f.checked)
            sexe = f.value;
    }

    let haarkleur = document.getElementById("haarkleur");
    let oogkleur = document.getElementById("oogkleur");
    let selectedHaarkleur = haarkleur.options[haarkleur.selectedIndex].innerText;
    let selectedhaarkleurvalue = haarkleur.options[haarkleur.selectedIndex].value; 
    let selectedoogkleur = oogkleur.options[oogkleur.selectedIndex].innerText;
    let selectedoogkleurvalue = oogkleur.options[oogkleur.selectedIndex].value;
    let grootte = document.getElementById("grootte").value;
    let gewicht = document.getElementById("gewicht").value;
    let wachtwoord = document.getElementById("wachtwoord").value;
    let check = document.getElementById("check").value;
    let lovecoins = 3;

    if (familienaam === "" || voornaam === "" || nickname === "" || geboortedatum === "" ||
        email === "" || fotonaam === "" || beroep === "" || sexe === "" ||
        grootte === "" || gewicht === "" || wachtwoord === "" || selectedhaarkleurvalue === "" || selectedoogkleurvalue ==="") {
        window.alert(" Gelieve alle velden in te vullen! ");
    } else {
        if (leeftijd < 18) {
            window.alert("Je moet minstens 18 jaar zijn om aan dating te doen! ");
            window.location.href = "https://www.ketnet.be/";
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

                //console.log("object gebruikersgegevens",data);

                let url = rooturl + '/profiel/create.php';
                let request = new Request(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
                fetch(request)
                    .then(function (resp) {
                        return resp.json();})
                    .then(function (data){
                        //console.log(data);
                        //upload een foto enkel als aanmaken van profiel is gelukt
                        if (f)
                            uploadFoto();
                        else
                            if (w)
                            fotoWebcamUpdate();
                        window.alert("Gebruiker aangemaakt!");
                    })
                        .catch(function (error){
                            //console.log("error profiel aanmaken");
                            //console.log(error);
                        });
            }
        }
    }
}



function uploadPicture(base64String) {
            //console.log('     • Foto wordt doorgestuurd naar de API.');
            naamWeb = nickname + '.jpg';
            let afbeelding = base64String;

            let url = 'https://scrumserver.tenobe.org/scrum/api/image/upload.php';

            let data = {
                naam: naamWeb,
                afbeelding: afbeelding
            }

            let request = new Request(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });

            fetch(request)
                .then(function (resp) {                     return resp.json(); })
                .then(function (data) {
                    //console.log('     ==> OK (Foto te vinden op url = ' + data.fileURL + ')');
                    //console.log('     • Foto inladen in IMG');
                    document.getElementById('uploadResult').src = data.fileURL;
                    //console.log('     ==> OK');
                    //console.log('==> Klaar');
                    finalWebcamFotoNaam = data.fileName;
                })
                .catch(function (error) { //console.log(error); 
                });
        }

function fotoWebcamUpdate ()
    {
        //update de foto name
    let profielMetFoto;
    let urlUpdate = 'https://scrumserver.tenobe.org/scrum/api/profiel/update.php';
    fetch(rooturl+"/profiel/read.php").then(function (resp){return resp.json()}).then(function (data){
    for (let profiel of data)
    {
        if (profiel.nickname === nickname)
        {
        profielMetFoto = profiel;
        profielMetFoto.foto = finalWebcamFotoNaam;
        //console.log("fotoweb naam van de updatefotoname functie: ", finalWebcamFotoNaam);
        //console.log("gezochte profiel web: ", profielMetFoto);
    

        let requestfoto = new Request(urlUpdate, {
            method: 'PUT',
            body: JSON.stringify(profielMetFoto),
            headers: new Headers({
            'Content-Type': 'application/json'
            })
            });
                
        fetch(requestfoto)
            .then(function (resp) { return resp.json(); })
            .then(function (data) { //console.log("profiel met juiste fotonaam: ",data);
                    //console.log("naam van fotoweb gewijzigd naar ", finalWebcamFotoNaam);
                    //window.alert("Profiel gewijzigd"); 
                    //window.location.href = "mijnProfiel.html";
                    setTimeout(function(){ window.location.href = "index.html";},500);
                            })
            .catch(function (error) { //console.log(error); 
            });
                //console.log("foto upload");
    }}}); 
}


//genereert base64 code van de gekozen foto
document.getElementById("foto").onchange = function base64Foto() {
    let imageFile = this.files[0];
    let fileReader = new FileReader();
    fileReader.onload = function (fileLoadedEvent) {
        let srcData = fileLoadedEvent.target.result;
        let newImage = document.createElement('img');
        newImage.src = srcData;
        document.getElementById("uploadedFoto").setAttribute('src', srcData);
        document.getElementById("dummy").innerHTML = newImage.outerHTML;
        document.getElementById("txt").value = document.getElementById("dummy").innerHTML;
        afbeelding = document.getElementById("txt").value;
    }
    fileReader.readAsDataURL(imageFile);
    naam = this.files[0].name;
}


//upload foto
function uploadFoto() {

    let urlFotoUpload = 'https://scrumserver.tenobe.org/scrum/api/image/upload.php';
    let responseFotoUpload;
    let dataFoto = ({
        naam: naam,
        afbeelding: afbeelding
    });
    //console.log("dataFoto: ", dataFoto);

    let requestfoto = new Request(urlFotoUpload, {
        method: 'POST',
        body: JSON.stringify(dataFoto),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
    
    fetch(requestfoto)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
            setTimeout(function(){window.location.href = "index.html";},500);
            responseFotoUpload = data;
            //console.log("data upload foto: ", data);
            
            finalFotoUrl = data.fileURL;
            finalFotoNaam = data.fileName;

            //console.log("foto naam: ", finalFotoNaam);
            //console.log("foto url: ", finalFotoUrl);
            
        })
        .catch(function (error) { console.log(error); });
        //console.log("buiten fetch bericht foto naam: ", finalFotoNaam);
        //console.log("buiten fetch bericht foto url: ", finalFotoUrl);
        //console.log(responseFotoUpload);
    //update de foto name
    let profielMetFoto;
    let urlUpdate = 'https://scrumserver.tenobe.org/scrum/api/profiel/update.php';
    fetch(rooturl+"/profiel/read.php").then(function (resp){return resp.json()}).then(function (data){
    for (let profiel of data)
    {
        if (profiel.nickname === nickname)
        {
        profielMetFoto = profiel;
        profielMetFoto.foto = finalFotoNaam;
        //console.log("foto naam van de updatefotoname functie: ", finalFotoNaam);
        //console.log("gezochte profiel: ", profielMetFoto);
    

        let requestfoto = new Request(urlUpdate, {
            method: 'PUT',
            body: JSON.stringify(profielMetFoto),
            headers: new Headers({
            'Content-Type': 'application/json'
            })
            });
                
        fetch(requestfoto)
            .then(function (resp) { return resp.json(); })
            .then(function (data) { //console.log("profiel met juiste fotonaam: ",data);
                    //console.log("naam van foto gewijzigd naar ", finalFotoNaam);
                    //window.alert("Profiel gewijzigd"); 
                    //window.location.href = "mijnProfiel.html";
                    setTimeout(function (){window.location.href = "index.html";},500);
                    
                            })
            .catch(function (error) { //console.log(error); 
            });
                //console.log("foto upload");
    }}}); 

}
