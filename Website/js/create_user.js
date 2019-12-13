

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



//function submit 
function submit() {
    let sexe = "";
    let familienaam = document.getElementById("familienaam").value;
    let voornaam = document.getElementById("voornaam").value;
    
    let nickname = document.getElementById("nickname").value;

    let geboortedatum = document.getElementById("geboortedatum").value;
    let email = document.getElementById("email").value;
    let foto = document.getElementById("foto").files[0].name;
    let beroep = document.getElementById("beroep").value;

    for (const f of document.getElementsByName("geslacht"))
       { 
           if(f.checked)
           sexe = f.value;
        }
    
    

    let haarkleur = document.getElementById("haarkleur");
    let oogkleur = document.getElementById("oogkleur");
    let grootte = document.getElementById("grootte").value;
    let gewicht = document.getElementById("gewicht").value;
    let wachtwoord = document.getElementById("wachtwoord").value;
    let check = document.getElementById("check").value;
    let lovecoins = 0;

    let selectedHaarkleur = haarkleur.options[haarkleur.selectedIndex].innerHTML;
    let selectedoogkleur = oogkleur.options[oogkleur.selectedIndex].innerHTML;

   
    if (familienaam === "" || voornaam === "" || nickname === "" || geboortedatum === "" ||
        email === "" || foto === "" || beroep === "" || sexe === "" ||
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
            foto: foto,
            beroep: beroep,
            sexe: sexe,
            haarkleur: selectedHaarkleur,
            oogkleur: selectedoogkleur,
            grootte: grootte,
            gewicht: gewicht,
            wachtwoord: wachtwoord,
            lovecoins: lovecoins
        });

    
        let url = rooturl + '/profiel/create.php';
        var request = new Request(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
        fetch(request)
            .then(function (resp) { return resp.json(); })
            .then(function (data) { console.log(data); })
            .catch(function (error) { console.log(error); });






    }
    }
};

    function encode() {
        var selectedfile = document.getElementById("foto").files;
            if (selectedfile.length > 0) {
              var imageFile = selectedfile[0];
              var fileReader = new FileReader();
             fileReader.onload = function(fileLoadedEvent) {
                var srcData = fileLoadedEvent.target.result;
                var newImage = document.createElement('img');
                newImage.src = srcData;
                document.getElementById("dummy").innerHTML = newImage.outerHTML;
                document.getElementById("txt").value = document.getElementById("dummy").innerHTML;
              }
              fileReader.readAsDataURL(imageFile);
            }
        }
    
    
        let naam = document.getElementById("foto").files[0].name;
        let afbeelding = document.getElementById("txt").value;
    
        let url = 'https://scrumserver.tenobe.org/scrum/api/image/upload.php';
    
        let data = {
            naam: naam,
            afbeelding: afbeelding
        }
    
        var request = new Request(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
    
        fetch(request)
            .then(function (resp) {                     return resp.json(); })
            .then(function (data) {
                console.log('     ==> OK (Foto te vinden op url = ' + data.fileURL + ')');
                console.log('     • Foto inladen in IMG');
                //document.getElementById('uploadResult').src = data.fileURL;
                console.log('     ==> OK');
                console.log('==> Klaar');
            })
            .catch(function (error) { console.log(error); });
    



initialisation();

document.getElementById("submit").onclick = submit;

