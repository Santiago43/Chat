
var wait = ms => new Promise((r, j) => setTimeout(r, ms));
var wsUri = "ws://localhost:30001";
var websocket = new WebSocket(wsUri); //creamos el socket

websocket.onopen = function (evt) { //manejamos los eventos...
	console.log("Conectado..."); //... y aparecerá en la pantalla
	ping();
	var a = {
		type: "nuevo",
		user: getCookie("usuario")
	};
	enviarMensaje(JSON.stringify(a));
};

websocket.onmessage = function (evt) { // cuando se recibe un mensaje
	console.log("Mensaje recibido:" + evt.data);
	var datos = evt.data;
	console.log(evt);
	//Rebote
	if (evt.data === "pong") {
		ping();
	} else {
		var obj = JSON.parse(datos);
		if(obj.tipo==="hash"){
			//Envío de código Hash para notificar a los demás que hay un nuevo conectado
			setCookie("hash",obj.hash,10);
			var nombreUser= getCookie("usuario");
			var texto = {
				tipo:'nuevo',
				user: nombreUser
			};
			enviarMensaje(JSON.stringify(texto));
		}
		else if(obj.tipo ==="conexion"){
			//Nueva conexión
			console.log(obj.mensaje);
			$("tbody").append('<tr> <td>'+obj.mensaje+'</td></tr>');
			$("#conectados").append('<option value="'+obj.mensaje+'">'+obj.mensaje+'</option>')
		}
		//$(".cajaContenedora").append("<b>" + chat.name + ": <b>" + chat.mensaje + "<br>");
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
	var usuario = {
		name: getCookie("user"),
		mensaje: $("#mensaje").val()}
	var vaina = JSON.stringify(usuario);
	var a = {
		type: 'message',
		message: vaina
	};
	console.log(vaina);
	enviarMensaje(JSON.stringify(a));
});

$("#privado").click(function () {

	var usuario = {
		name: getCookie("usuario"),
		mensaje: $("#mensaje").val()
	}
	var vaina = JSON.stringify(usuario);
	var a = {
		tipo: "private",
		nombre: usuario1,
		hashOrigen :"",
		hashDestino :"",
		message: vaina
	};
	console.log(vaina);
	enviarMensaje(JSON.stringify(a));
});



function ping() {
	myPing = {tipo: "ping",message: "heartbeating"};
	var prom = wait(28000)  // prom, is a promise
	var showdone = () => enviarMensaje(JSON.stringify(myPing));
	prom.then(showdone)
}


