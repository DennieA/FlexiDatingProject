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

function logout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("wachtwoord");
    window.location.href = "index.html";
}

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
        OogkleurId.add(nieuweOogkleur);
    };

};

/*let hoofdDiv = document.getElementById("mid");
document.onload = function ()
{
    hoofdDiv.innerHTML = "";
}*/
let user = sessionStorage.getItem("userId");

/* zoek een gebruiker op id*/
let rooturl = "https://scrumserver.tenobe.org/scrum/api";
let urlUpdate = 'https://scrumserver.tenobe.org/scrum/api/profiel/update.php';
fetch(rooturl+"/profiel/read_one.php?id="+user).then(function (resp){return resp.json()}).then(GebruikersGegevens);

let profiel;
let selectedfile = "";
let naam = "";
let afbeelding = "";
let finalFotoNaam;
let finalFotoUrl;


function GebruikersGegevens (el){
    
        console.log(el);
        profiel = el;
        document.getElementById("hoofd").innerText = 'Gegevens van ' + el.voornaam + ' ' + el.familienaam;
        document.getElementById("familienaam").value = el.familienaam;
        document.getElementById("voornaam").value = el.voornaam;
        document.getElementById("nickname").value = el.nickname;
        document.getElementById("geboortedatum").value = el.geboortedatum;
        document.getElementById("email").value = el.email;
        document.getElementById("uploadedFoto").setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + el.foto);
        document.getElementById('uploadedFoto').setAttribute('alt', 'foto van ' + el.voornaam + ' ' + el.familienaam);
        document.getElementById("beroep").value = el.beroep;
        document.getElementById("haarkleur").value = el.haarkleur;
        for (const f of document.getElementsByName("geslacht")) {
            if (f.value === el.sexe)
                f.checked = true;
        }
        
        document.getElementById("oogkleur").value = el.oogkleur;
        document.getElementById("grootte").value = el.grootte;
        document.getElementById("gewicht").value = el.gewicht;

        //document.getElementById("lovecoins").value = el.lovecoins;
        
}

initialisation();
document.getElementById("submit").onclick = submit;

function submit() {
console.log("WIJZIG PROFIEL PAGINA:");

    profiel.familienaam = document.getElementById("familienaam").value;
    profiel.voornaam = document.getElementById("voornaam").value;
    profiel.nickname = document.getElementById("nickname").value;
    profiel.geboortedatum = document.getElementById("geboortedatum").value;
    profiel.email = document.getElementById("email").value;

    selectedfile = document.getElementById("foto").files;
    if (selectedfile.length !== 0)
    {
        profiel.foto = selectedfile[0].name;
        console.log("profiel.foto: ", profiel.foto);
                                                       
    }

    profiel.beroep = document.getElementById("beroep").value;
    
    for (const f of document.getElementsByName("geslacht")) {
        if (f.checked)
            profiel.sexe = f.value;
    }
    let haarkleur = document.getElementById("haarkleur");
    profiel.haarkleur = haarkleur.options[haarkleur.selectedIndex].innerText;
    let oogkleur = document.getElementById("oogkleur");
    profiel.oogkleur = oogkleur.options[oogkleur.selectedIndex].innerHTML;
    profiel.grootte = document.getElementById("grootte").value;
    profiel.gewicht = document.getElementById("gewicht").value;
    //profiel.lovecoins = document.getElementById("lovecoins").value;
    
    if (profiel.familienaam === "" || profiel.voornaam === "" || profiel.nickname === "" || profiel.geboortedatum === "" || profiel.email === "" || profiel.foto === "" || profiel.beroep === "" || profiel.lovecoins === "" ||profiel.sexe === "" || profiel.grootte === "" || profiel.gewicht === "" ) 
        window.alert(" Gelieve alle velden in te vullen! ");
            
            
            let request = new Request(urlUpdate, {
                method: 'PUT',
                body: JSON.stringify(profiel),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });

            fetch(request)
                .then(function (resp) { return resp.json(); })
                .then(function (data) { console.log(data);
                    window.alert("Profiel gewijzigd"); 
                    if (selectedfile.length !== 0)
                    {
                        for(let x =1; x<=100;x++){}
                    uploadFoto();
                    }
                    else {
                    window.location.href = "mijnProfiel.html";}
                 })
                .catch(function (error) { console.log(error); });

    
           
};



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
    
    document.getElementById('uploadedFoto').setAttribute('alt', 'foto van ' + document.getElementById("voornaam").value + ' ' + document.getElementById("familienaam").value);
}
//upload foto
function uploadFoto() {

    let urlFotoUpload = 'https://scrumserver.tenobe.org/scrum/api/image/upload.php';
    let responseFotoUpload;
    let dataFoto = ({
        naam: naam,
        afbeelding: afbeelding
    });
    console.log("dataFoto: ", dataFoto);

    let requestfoto = new Request(urlFotoUpload, {
        method: 'POST',
        body: JSON.stringify(dataFoto),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
    
    fetch(requestfoto)
        .then(function (resp) { return resp.json(); })
        .then(Gegevens)
        .catch(function (error) { console.log(error); });    
            
            
        

        console.log("buiten fetch-upload bericht foto naam: ",finalFotoNaam);
        console.log("buiten fetch-upload bericht foto url: ", finalFotoUrl);
        //console.log(responseFotoUpload);
    
        //update de foto name
    let profielMetFoto;
    
    function Gegevens (data) {
        //responseFotoUpload = data;
        console.log("data upload foto: ", data);
        
        finalFotoUrl = data.fileURL;
        finalFotoNaam = data.fileName;

        console.log("foto naam: ", finalFotoNaam);
        console.log("foto url: ", finalFotoUrl);

        console.log("test: ik ben in de foto upload");
        fetch(rooturl+"/profiel/read_one.php?id="+user).then(function (resp){return resp.json()}).then(function (prof){

            profielMetFoto = prof;
            console.log("profile met verkeerde naam: ", profielMetFoto);
            profielMetFoto.foto = finalFotoNaam;
            console.log("foto naam van de updatefotoname functie: ", finalFotoNaam);
            console.log("gezochte profiel met juiste naam: ", profielMetFoto);
        
    
            let requestfoto = new Request(urlUpdate, {
                method: 'PUT',
                body: JSON.stringify(profielMetFoto),
                headers: new Headers({
                'Content-Type': 'application/json'
                })
                });
                    
            fetch(requestfoto)
                .then(function (resp) { return resp.json(); })
                .then(function (data) { console.log("profiel met juiste fotonaam: ",data);
                        console.log("naam van foto gewijzigd naar ", finalFotoNaam);
                        //window.alert("Profiel gewijzigd"); 
                        //window.location.href = "mijnProfiel.html";
                        for (let x = 1; x<=1000; x++)
                        {}
                        window.location.href = "mijnProfiel.html";
                                })
                .catch(function (error) { console.log(error); });
                    //console.log("foto upload");
        }); 
    }

    

}