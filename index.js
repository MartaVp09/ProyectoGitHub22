const fs = require("fs");
const express = require('express');
const app=express();
const modelo = require("./servidor/modelo.js");

const PORT = process.env.PORT || 3000;

let juego = new modelo.Juego();

app.use(express.static(__dirname + "/"));

app.get("/", function(request,response){
	var contenido=fs.readFileSync(__dirname+"/cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

app.get("/agregarUsuario/:nick", function(request, response){
	let nick = request.params.nick;
	let res;
	res = juego.agregarUsuario(nick);
	response.send(res);  				// Lo que aquí se llama res en clienteRest se llama data
});

app.get("/crearPartida/:nick", function(request, response){
	let  nick = request.params.nick;
	let res = juego.jugadorCreaPartida(nick);

	response.send(res);
})

app.get("/unirseAPartida/:nick/:codigo", function(request, response){
	let codigo = request.params.codigo;
	let nick = request.params.nick;

	let res = juego.jugadorSeUneAPartida(nick,codigo);

	response.send(res);
});

app.get("/obtenerPartidas", function(request, response){
	let res = juego.obtenerPartidas();

	response.send(res);
});

app.get("/obtenerPartidasDisponibles", function(request, response){
	let res = juego.obtenerPartidasDisponibles();

	response.send(res);
});

//Start the server

app.listen(PORT, () => {
  console.log(`App está escuchando en el puerto ${PORT}`);
  console.log('Ctrl+C para salir.');
});
