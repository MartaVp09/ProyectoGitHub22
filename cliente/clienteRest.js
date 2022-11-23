function ClienteRest(){
	this.nick;	
	this.agregarUsuario=function(nick){
		let cli=this;
		$.getJSON("/agregarUsuario/"+nick,function(data){
			//se ejecuta cuando conteste el servidor
			console.log(data);
			if (data.nick!=-1){
				console.log("Usuario "+data.nick+" registrado")
				cli.nick=data.nick;
				$.cookie("nick",data.nick);
				cws.conectar();
				iu.mostrarHome();
			}
			else{
				console.log("No se ha podido registrar el usuario")
				iu.mostrarModal("El nick ya está en uso");
				iu.mostrarAgregarUsuario();
			}
		});
	}
	this.comprobarUsuario=function(){
		let cli=this;
		$.getJSON("/comprobarUsuario/"+rest.nick, function(data){
			if (data.nick!=-1){
				console.log("Usuario "+data.nick+" activo");
				cws.conectar();
				iu.mostrarHome();
			}
			else{
				console.log("El usuario no está activo")
				iu.mostrarAgregarUsuario();
			}
		})
	}

	this.salir=function(){
		let cli=this;
		$.getJSON("/salir/"+cli.nick,function(data){
			//se ejecuta cuando conteste el servidor
			if(data.codigo!=1){
				console.log("Partida "+data.codigo+" eliminada.");
				console.log("El usuario "+cli.nick+" ha salido del juego.")
			}else{
				console.log("No existe partida creada por "+cli.nick);
			}
		});
	}

	this.obtenerListaPartidasDisponibles=function(){
		let cli=this;
		$.getJSON("/obtenerPartidasDisponibles",function(lista){
			iu.mostrarListaDePartidasDisponibles(lista);
		});
	}
}