const fs = require("fs");
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const modelo = require("./servidor/modelo.js");
const sWS = require("./servidor/servidorWS.js");

const passport = require("passport");
require("./servidor/passport-setup.js");

const PORT = process.env.PORT || 3000;
var args = process.argv.slice(2);


let juego = new modelo.Juego(args[0]);
let servidorws = new sWS.ServidorWS();

app.use(express.static(__dirname + "/"));

const cookieSession=require("cookie-session");

app.use(cookieSession({
  name: 'Batalla naval',
  keys: ['key1', 'key2']
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (request, response) {
	var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
	response.setHeader("Content-type", "text/html");
	response.send(contenido);
});

app.get("/agregarUsuario/:nick", function (request, response) {
	let nick = request.params.nick;
	let res;
	res = juego.agregarUsuario(nick);
	response.send(res);  				// Lo que aquí se llama res en clienteRest se llama data
});

app.get("/comprobarUsuario/:nick", function (request, response){
	let nick =request.params.nick;
	let us=juego.obtenerUsuario(nick);
	let res ={ "nick": -1};
	if(us){
		res.nick=us.nick;
	}
	response.send(res);
})

app.get("/crearPartida/:nick", function (request, response) {
	let nick = request.params.nick;
	let res = juego.jugadorCreaPartida(nick);

	response.send(res);
})

app.get("/unirseAPartida/:nick/:codigo", function (request, response) {
	let codigo = request.params.codigo;
	let nick = request.params.nick;

	let res = juego.jugadorSeUneAPartida(nick, codigo);

	response.send(res);
});

// app.get("/salir/:nick", function (request, response) {
// 	let nick = request.params.nick;
// 	let res = juego.salir(nick);
// 	response.send(res);
// });

app.get("/obtenerLogs",function(request,response){
	juego.obtenerLogs(function(logs){
		response.send(logs);
	})
});

app.get("/obtenerPartidas", function (request, response) {
	let res = juego.obtenerPartidas();

	response.send(res);
});

app.get("/obtenerPartidasDisponibles", function (request, response) {
	let res = juego.obtenerPartidasDisponibles();

	response.send(res);
});

app.get("/auth/google",passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/fallo' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
});

app.get("/good", function(request,response){
  var nick=request.user.emails[0].value;
  if (nick){
    juego.agregarUsuario(nick);
  }
  response.cookie('nick',nick);
  response.redirect('/');
});

app.get("/fallo",function(request,response){
  response.send({nick:"nook"})
})

//Start the server
server.listen(3000, () => {
	console.log(`App está escuchando en el puerto ${PORT}`);
	console.log('Ctrl+C para salir.');
});
servidorws.lanzarServidorWS(io, juego);

/*
app.listen(PORT, () => {
  console.log(`App está escuchando en el puerto ${PORT}`);
  console.log('Ctrl+C para salir.');
});
*/
