var original = document.getElementById("linkbarra").innerHTML;
var counter = 0; //Contatore usato per la barra desktop notif..

function dainomedomain() /* Associa l'innerHTML al nome domain catturato */
{
if (typeof(Storage) !== "undefined")
{
document.getElementById("outputdomain").innerHTML = sessionStorage.domain;
document.getElementById("outputdomain2").innerHTML = sessionStorage.domain;
}
else
{
document.getElementById("outputdomain").innerHTML = "non supportato";
}
}

function ilnomeworkspace() /* Cattura il nome domain da signin.html */
{
if (typeof(Storage) !== "undefined")
{
sessionStorage.domain = String(document.getElementById("nomeworkspace").value);
}
}


function seguibarra() /* Cambia l'attributo position della barra */
{
if (window.pageYOffset <= 300)
{ document.getElementById("miabarra").style.position="absolute"; }
else
{ document.getElementById("miabarra").style.position="fixed"; }
}

function toglicookie() /* Cancella il blocco del messaggio dei cookie */
{
document.getElementById("chiudi").innerHTML = "";
document.getElementById("chiudi").outerHTML = "";
}

function ridimensionamento() /* Cambia contenuto barra se si ridimensiona */
{
if (window.outerWidth < 600)
{
document.getElementById("linkbarra").innerHTML = "<img src=\"menu.png\" width=20 height=20/> ";
}
else
{
document.getElementById("linkbarra").innerHTML = original;
}
}

function desktopnotif() /* Gestisce la notifica "attiva desktop notif. */
{
/*Caso 1*/
if (counter!=1)
{
document.getElementById("deskcol").style = "background-color:#00A040";
document.getElementById("desknot").innerHTML = "We&nbspstrongly&nbsprecommend&nbspenabling&nbspdesktop&nbspnotifications&nbspif&nbspyou'll&nbspbe&nbspusing&nbspLasck&nbspon&nbspthis&nbspcomputer.&nbsp<u style=\"cursor:pointer;\">Enable&nbspnotifications</u>";
counter=1;
}
else
{
document.getElementById("deskcol").outerHTML = "";
document.getElementById("desknot").innerHTML = "";
document.getElementById("desknot").outerHTML = "";
}
}

function aggiungiCanale() { /* Aggiunge un canale nella lista canali */ 

var listacanali = document.getElementById("CANALI");
var arrayC = listacanali.getElementsByTagName("span"); //contiene tutti gli span del contenuto dei canali
var bloccoMessaggi = document.getElementById("bloccomessaggi"); //dove aggiungere il blocco del nuovo canale


/*Setta il numero del canale*/
for (var i = 0; i<=arrayC.length; i++)
{}

var idNuovoCanale = "canale" + i;

// crea l'elemento da mettere dentro "CANALI"
var nuovocanale = document.createElement("span");
var laClasse = document.createAttribute("class");
laClasse.value = "channel"
nuovocanale.setAttributeNode(laClasse);
nuovocanale.setAttribute("onclick","javascript: attivaCanale(this)");
nuovocanale.setAttribute("id","# Canale " + i);
var t = document.createTextNode("# Canale " + i);
nuovocanale.appendChild(t);
listacanali.appendChild(nuovocanale);


// crea il blocco dei messaggi del nuovo canale
var nuovoBlocco = document.createElement("span");
var altraClasse = document.createAttribute("class");
altraClasse.value = "messaggi";
nuovoBlocco.setAttributeNode(altraClasse);
nuovoBlocco.setAttribute("id","iMessaggi# Canale " + i);
bloccoMessaggi.appendChild(nuovoBlocco);

}

// Restituisce l'ID del canale attivo
function ottieniIDCanaleAttivo()
{
var iCanali = document.getElementById("CANALI");
var arrayCanali = iCanali.getElementsByTagName("span");
var i=0;
while (arrayCanali[i].className=="channel")
  {
      i++; // i punta al canale attivo
  }
return arrayCanali[i].getAttribute("id"); // Contiene id del canale attivo
}

// Restituisce l'ID del blocco del canale attivo. Devi passargli l'ID del canale attivo come input
function ottieniIdBloccoAttivo(id)
{
var bloccoMessaggi = document.getElementById("bloccomessaggi");
var arrayBlocchi = bloccoMessaggi.getElementsByTagName("span");
var i=0;

while (arrayBlocchi[i].getAttribute("id") != "iMessaggi" + id)
  {
    i++; // i punta al blocco messaggi del canale attivo
  }
return arrayBlocchi[i].getAttribute("id");
}

/* Aggiunge il messaggio scritto premendo ENTER --------------------- */
function aggiungiMessaggio(event)
{
var idCanaleAttivo = ottieniIDCanaleAttivo(); // Individua l'ID del canale attivo....
var idBloccoCanaleAttivo = ottieniIdBloccoAttivo(idCanaleAttivo); // ....per individuare l'ID del blocco del canale attivo.

								  // Gestisci l'evento della pressione ENTER, appendendo il messaggio scritto
var nodoInput = document.getElementById("chat");

if (event.keyCode === 13 && nodoInput.value) 			  // Se premi ENTER...
  {
    var tuttaLaChat = document.getElementById(idBloccoCanaleAttivo); // Individua il blocco del canale attivo grazie al suo ID
    var messaggio = nodoInput.value;				     // Ottieni il messaggio da appendere

    var nuovoMessaggio = document.createTextNode(messaggio);	     // Crea nodo col messaggio
    var spazio = document.createElement("br");
    var nomeUtente = document.createTextNode("<" + getNomeUtente() + "> ");
    tuttaLaChat.appendChild(spazio);
    tuttaLaChat.appendChild(nomeUtente);
    tuttaLaChat.appendChild(nuovoMessaggio);			     // Appendi sia un "/n" sia il messaggio
    nodoInput.value="";						     // Cancella ciò che è stato scritto nell'input bar
    var bloccoMessaggi = document.getElementById("bloccomessaggi");
    bloccoMessaggi.scrollTop += 100;				     // Scrolla ad ogni messaggio inviato in modo da "seguire" i messaggi
  }
}

/* Function che mostra il contenuto del canale che lo invoca */

function attivaCanale(elemento) 
{
// contiene i nomi dei canali nella barra a sinistra
var iCanali = document.getElementById("CANALI");
var arrayCanali = iCanali.getElementsByTagName("span");
// contiene i blocchi dei messaggi
var bloccoMessaggi = document.getElementById("bloccomessaggi");
var arrayBlocchi = bloccoMessaggi.getElementsByTagName("span");
// contiene il blocco dei messaggi da mostrare
var idNuovoBlocco = "iMessaggi" +  elemento.getAttribute("id");
var elementoBlocco = document.getElementById(idNuovoBlocco);

// Disattiva i canali non attivi
for (var i=0; i<arrayCanali.length; i++)
  {
      arrayCanali[i].className = "channel"; // "spegni" canale precedentemente attivo
      arrayBlocchi[i].style.display = "none"; // nascondi tutto il contenuto di tutti i canali
  }

// Attiva quello cliccato
elemento.className = "channelAttivo";
elementoBlocco.style.display = "table-cell";

// Setta il nome del canale nella barra bianca e nel titolo
// (usa l'id)
var nomeCanale = document.getElementById("nomecanale");
nomeCanale.innerHTML = elemento.getAttribute("id");
document.title = elemento.getAttribute("id") + " | " + sessionStorage.domain + " Lasck";

// Scrolla in fondo a tutto
bloccoMessaggi.scrollTop = 99999999999999;

}

// Piccola function per settare il nome del domain nella barra viola in alto
// a sinistra
function settaDomain()
{
var dom = sessionStorage.domain;
document.getElementById("nomedomain").innerHTML = dom.bold();
}


// Function che mostra immagini nella chat, dopo avrne passata una come input premendo il pulsante verde
function mostraImmagine(file)
{

// Per prima cosa, otteniamo il blocco messaggi del canale attivo
var idCanaleAttivo = ottieniIDCanaleAttivo(); // Individua l'ID del canale attivo....
var idBloccoCanaleAttivo = ottieniIdBloccoAttivo(idCanaleAttivo); // ....per individuare l'ID del blocco del canale attivo.

// Crea nuovo tag immagine e appendilo nel canale attivo
var uploadImmagine = document.createElement("img");
var accapo = document.createElement("br");
var accapo2 = document.createElement("br");
var nomeUtente = getNomeUtente();

// Ridimensiona l'immagine indipendentemente dal suo size originario
uploadImmagine.style.height="200px";
uploadImmagine.style.width="200px";

// Definisco il blocco del bottone input nascosto....
var file = document.querySelector("#catturaImmagine").files[0];
// ...ed un oggetto FileReader, che leggerà il file come URL Data
var reader = new FileReader();

reader.addEventListener("load", function() { uploadImmagine.src = reader.result; }, false);

if (file) // Se esiste il file
  {
  // Appendi l'immagine, appendendo blocchi e messaggi per una miglior formattazione
  reader.readAsDataURL(file);
  document.getElementById(idBloccoCanaleAttivo).append(accapo);
  document.getElementById(idBloccoCanaleAttivo).append("-- " + nomeUtente + " uploaded this image:");
  document.getElementById(idBloccoCanaleAttivo).append(accapo2);
  document.getElementById(idBloccoCanaleAttivo).append(uploadImmagine);
  var bloccoMessaggi = document.getElementById("bloccomessaggi");
  bloccoMessaggi.scrollTop += 9999;
  }
}


// function che cattura il nome utente
function getNomeUtente()
{
var nome = document.getElementById("nomeUtente").innerHTML;
return nome;
}

