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
	
	this.crearPartida=function(user){
		//obtener código único
		//crear partida con propietario nick
		//devolver el código
		let codigo=Date.now();
		this.partidas[codigo]=new Partida(codigo,user);
		return codigo;
	}
	
	this.unirseAPartida=function(codigo,user){
		if (this.partidas[codigo]){
			this.partidas[codigo].agregarJugador(user);
		}else{
			console.log("La partida no existe");
		}
	}
	
	this.obtenerPartidas=function(){
		//return this.partidas;
		let lista=[];
		for (let key in this.partidas){
			lista.push({"codigo":key,"owner":this.partidas[key].owner});
		}
		return lista;
	}
	
	this.obtenerPartidasDisponibles=function(){
		//devolver solo las partidas sin completar
		let lista=[];
		for (let key in this.partidas){
			if(this.partidas[key].jugadores.length<2){
				lista.push({"codigo":key,"owner":this.partidas[key].owner});
			}
		}
		return lista;
	}
}

function Usuario(nick, juego){
	this.nick=nick;
	this.juego=juego;
	this.crearPartida=function(){
		return this.juego.crearPartida(this);
	}
	this.unirseAPartida=function(codigo){
		this.juego.unirseAPartida(codigo,this);	
	}
}

function Partida(codigo, user){
	this.codigo=codigo;
	this.owner=user;
	this.jugadores=[];
	this.fase='inicial'; 		//new Inicial()
	//this.maxJugadores=2;
	
	this.agregarJugador=function(user){
		if(this.jugadores.length<2){
			this.jugadores.push(user);
		}else{
			console.log("La partida ya tiene dos jugadores");
		}
	}
	
	this.agregarJugador(this.owner);
	
}

