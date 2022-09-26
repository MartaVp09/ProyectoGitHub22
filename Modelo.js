function Juego(){
	this.partidas=[];
	this.usuarios={};  //array asociativo [clave][objeto]
	
	this.agregarUsuario=function(nick){
		if(!this.usuarios[nick]){
			this.usuarios[nick]=new Usuario(nick, this)
		}
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];	
	}
	
	this.crearPartida=function(nick){
		//obtener código único
		//crear partida con propietario nick
		//devolver el código
		let codigo=Date.now();
		this.partidas[codigo]=new Partida(codigo,nick);
		return codigo;
	}
}

function Usuario(nick, juego){
	this.nick=nick;
	this.juego=juego;
	this.crearPartida=function(){
		return this.juego.crearPartida(this.nick)
	}
}

function Partida(codigo, nick){
	this.codigo=codigo;
	this.owner=nick;
	this.jugadores=[];
	//this.maxJugadores=2;
	
	this.agregarJugador=function(nick){
		if(this.jugadores.length<2){
			this.jugadores.push(nick);
		}
	}
	
	
}

