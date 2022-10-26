function Juego(){
	this.partidas=[];
	this.usuarios={};  //array asociativo [clave][objeto]
	
	this.agregarUsuario=function(nick){
		let res={"nick":-1};
		if(!this.usuarios[nick]){
			this.usuarios[nick]=new Usuario(nick, this)
			res={"nick":nick};
			console.log("Nuevo usuario: "+nick);
		}
		return res;
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];	
		console.log("El usuario "+nick+" ha salido del juego.")
	}
	this.eliminarPartida=function(index){
		console.log("Partida "+this.partidas[index].codigo+" eliminada.");
		delete this.partidas[index];	
	}

	this.jugadorCreaPartida=function(nick){
		let usr = this.usuarios[nick];  //juego.obtenerUsuario(nick)
		let res = {"codigo":-1};
		let codigo;

		if (usr){
			codigo = usr.crearPartida();
			res={"codigo":codigo};
		}

		return res;
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
		let res=-1;
		if (this.partidas[codigo]){
			res=this.partidas[codigo].agregarJugador(user);
		}else{
			console.log("La partida no existe");
		}
		return res;
	}

	this.jugadorSeUneAPartida=function(nick, codigo){
		let usr=this.usuarios[nick];
		let res={"codigo":-1};
		let valor;

		if (usr){
			valor = this.unirseAPartida(codigo, usr);
			res={"codigo":valor};
		}
		return res;
	}
	
	this.salir=function(nick){
		let res={"codigo":-1};
		this.eliminarUsuario(nick);
		for (let key in this.partidas){
			if(this.partidas[key].owner.nick==nick){
				res={"codigo":this.partidas[key].codigo};
				this.eliminarPartida(key);
			}
		}
		return res;
	}
	
	this.obtenerPartidas=function(){
		//return this.partidas;
		let lista=[];
		for (let key in this.partidas){
			lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
		}
		return lista;
	}
	
	this.obtenerPartidasDisponibles=function(){
		//devolver solo las partidas sin completar
		let lista=[];
		for (let key in this.partidas){
			if(this.partidas[key].jugadores.length<2){
				lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
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
	this.maxJugadores=2;
	
	this.agregarJugador=function(usr){
		let res=this.codigo;
		if (this.hayHueco()){
			this.jugadores.push(usr);
			console.log("El usuario "+usr.nick+" se une a la partida "+this.codigo)
		}
		else{
			res=-1;
			console.log("La partida está completa")
		}
		return res;
	}

	this.comprobarFase=function(){
		if(!this.hayHueco()){
			this.fase='jugando';
		}
	}
	
	this.hayHueco=function(){
		return (this.jugadores.length<this.maxJugadores);
	}

	this.agregarJugador(this.owner);
	
}

module.exports.Juego = Juego;








