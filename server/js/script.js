
var wait = ms => new Promise((r, j) => setTimeout(r, ms));
var wsUri = "ws://localhost:30001";
var websocket = new WebSocket(wsUri); //creamos el socket

websocket.onopen = function (evt) { //manejamos los eventos...
	console.log("Conectado..."); //... y aparecerá en la pantalla
	ping();
	var a = {
		tipo: "nuevo",
		user: getCookie("usuario"),
		hash: getCookie("hash")
	};
	enviarMensaje(JSON.stringify(a));
};

websocket.onmessage = function (evt) { // cuando se recibe un mensaje
	console.log("Mensaje recibido:" + evt.data);
	console.log(evt);
	//Rebote
	if (evt.data === "pong") {
		ping();
	} else {
		var obj = JSON.parse(evt.data);
		if(obj.tipo==="hash"){
			//Envío de código Hash para notificar a los demás que hay un nuevo conectado
			setCookie("hash",obj.hash,10);
			var nombreUser= getCookie("usuario");
			var texto = {
				tipo:'nuevo',
				hash: getCookie("hash"),
				usuario: nombreUser
			};
			var conectados = obj.conectados;
			for (let index = 0; index < conectados.length; index++) {
				var user = conectados[index];
				$("tbody").append('<tr> <td>'+conectados[index].usuario+'</td></tr>');
				$("#conectados").append('<option value="'+conectados[index].hash+'">'+conectados[index].usuario+'</option>')
			}
			enviarMensaje(JSON.stringify(texto));

		}
		else if(obj.tipo ==="conexion"){
			//Nueva conexión
			console.log(obj.mensaje);
			$("tbody").append('<tr> <td>'+obj.nombre+'</td></tr>');
			$("#conectados").append('<option value="'+obj.hash+'">'+obj.nombre+'</option>')
		}
		else if(obj.tipo==="publico"){
			$(".cajaContenedora").append("<b>" + obj.nombre + ": </b>" + obj.mensaje + "<br>");
		}
		else if(obj.tipo==="privado"){
			$(".cajaContenedora").append("<b>" + obj.nombre + "(en privado): </b>" + obj.mensaje + "<br>")
		}
		
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
		nombre: getCookie("usuario"),
		mensaje: $("#mensaje").val()
	}
	var mensajePublico = JSON.stringify(usuario);
	var a = {
		tipo: 'publico',
		message: mensajePublico
	};
	$(".cajaContenedora").append("<b>" + usuario.nombre + ": </b>" + usuario.mensaje + "<br>");
//	console.log(vaina);
	enviarMensaje(JSON.stringify(a));
});

$("#privado").click(function () {

	var usuario = {
		name: getCookie("usuario"),
		mensaje: $("#mensaje").val()
	}
	var mensajePrivado = JSON.stringify(usuario);
	var a = {
		tipo: "privado",
		hashDestino :$("#conectados").val(),
		message: mensajePrivado
	};
	$(".cajaContenedora").append("<b>" + usuario.nombre + "(en privado): </b>" + usuario.mensaje + "<br>");
//	console.log(vaina);
	enviarMensaje(JSON.stringify(a));
});



function ping() {
	myPing = {tipo: "ping",message: "heartbeating"};
	var prom = wait(28000)  // prom, is a promise
	var showdone = () => enviarMensaje(JSON.stringify(myPing));
	prom.then(showdone)
}


