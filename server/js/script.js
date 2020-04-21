
var wait = ms => new Promise((r, j) => setTimeout(r, ms));
var wsUri = "ws://localhost:30001";
var websocket = new WebSocket(wsUri); //creamos el socket
var usuario1;


usuario1 = getCookie("cookie");
console.log(usuario1);

websocket.onopen = function (evt) { //manejamos los eventos...
	console.log("Conectado..."); //... y aparecerá en la pantalla
	ping();
	var a = {
		type: "nuevo",
		user: usuario1
	};
	websocket(JSON.stringify(a));
};

websocket.onmessage = function (evt) { // cuando se recibe un mensaje
	console.log("Mensaje recibido:" + evt.data);
	var datos = evt.data;
	console.log(evt);
	if (evt.data === "pong") {
		ping();
	} else {
		var chat = JSON.parse(datos);
		$(".cajaContenedora").append("<b>" + chat.name + ": <b>" + chat.mensaje + "<br>");
	}

};
websocket.onerror = function (evt) {
	console.log("oho!.. error:" + evt.data);
};


function enviarMensaje(texto) {
	websocket.send(texto);
	console.log("Enviando:" + texto);
};

 $("#enviar").click(function () {
	var usuario = {name: usuario1,mensaje: $("#mensaje").val()}
	var vaina = JSON.stringify(usuario);
	var a = {
		type: 'message',
		message: vaina
	};
	console.log(vaina);
	enviarMensaje(JSON.stringify(a));
});

$("#privado").click(function () {

	var usuario = {name: usuario1,mensaje: $("#mensaje").val()}
	var vaina = JSON.stringify(usuario);
	var a = {
		type: "private",
		nombre: usuario1,
		hashOrigen :"",
		hashDestino _"",
		message: vaina
	};
	console.log(vaina);
	enviarMensaje(JSON.stringify(a));
});



function ping() {
	myPing = {type: "ping",message: "heartbeating"};
	var prom = wait(28000)  // prom, is a promise
	var showdone = () => enviarMensaje(JSON.stringify(myPing));
	prom.then(showdone)
}


function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
} 