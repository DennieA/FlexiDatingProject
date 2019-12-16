"use strict"


function logout() {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("wachtwoord");
    window.location.href = "../Website/index.html";
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
fetch(rooturl+"/profiel/read_one.php?id="+user).then(function (resp){return resp.json()}).then(GebruikersGegevens);

let profiel;

function GebruikersGegevens (el){
    
        console.log(el);
        profiel = el;
        document.getElementById("hoofd").innerText = 'Gegevans van ' + el.voornaam + ' ' + el.familienaam;
        document.getElementById("familienaam").value = el.familienaam;
        document.getElementById("voornaam").value = el.voornaam;
        document.getElementById("nickname").value = el.nickname;
        document.getElementById("geboortedatum").value = el.geboortedatum;
        document.getElementById("email").value = el.email;
        document.getElementById("uploadedFoto").setAttribute('src', 'https://scrumserver.tenobe.org/scrum/image' + el.foto);
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
        
}

function submit() {
    profiel.familienaam = document.getElementById("familienaam").value;
    profiel.voornaam = document.getElementById("voornaam").value;
    profiel.nickname = document.getElementById("nickname").value;
    profiel.geboortedatum = document.getElementById("geboortedatum").value;
    profiel.email = document.getElementById("email").value;

    let selectedfile = document.getElementById("foto").files;
    if (selectedfile.length !== 0)
    {
        profiel.foto = selectedfile[0].name;
        uploadFoto(selectedfile);                                                
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
    profiel.lovecoins = document.getElementById("lovecoins").value;
    if (profiel.familienaam === "" || profiel.voornaam === "" || profiel.nickname === "" || profiel.geboortedatum === "" || profiel.email === "" || profiel.foto === "" || profiel.beroep === "" || profiel.lovecoins === "" ||profiel.sexe === "" || profiel.grootte === "" || profiel.gewicht === "" ) 
        window.alert(" Gelieve alle velden in te vullen! ");
            
            let urlUpdate = 'https://scrumserver.tenobe.org/scrum/api/profiel/update.php';
            var request = new Request(urlUpdate, {
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
                    window.location.href = "mijnProfiel.html";
                 })
                .catch(function (error) { console.log(error); });

    
           
};

initialisation();

document.getElementById("submit").onclick = submit;

function uploadFoto(selectedfile)
{
        let imageFile = selectedfile[0];
        let fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            let srcData = fileLoadedEvent.target.result;
            let newImage = document.createElement('img');
            newImage.src = srcData;
            document.getElementById("dummy").innerHTML = newImage.outerHTML;
            document.getElementById("txt").value = document.getElementById("dummy").innerHTML;
                                                        }
        fileReader.readAsDataURL(imageFile);
        let naam = selectedfile[0].name;
        console.log("img name: ",naam);
        let afbeelding = document.getElementById("txt").value;
    
        let url = 'https://scrumserver.tenobe.org/scrum/api/image/upload.php';
    
        let dataFoto = {
            naam: naam,
            afbeelding: afbeelding
        }
    
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