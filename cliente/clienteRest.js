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
	this.comprobarUsuario=function(nick){
		let cli=this;
		$.getJSON("/comprobarUsuario/"+nick, function(data){
			if (data.nick!=-1){
				console.log("Usuario "+data.nick+" activo");
				//cws.conectar();
				//iu.mostrarHome();
				iu.recuperarPartida();
			}
			else{
				console.log("El usuario no está activo")
				iu.mostrarAgregarUsuario();
			}
		})
	}

	this.obtenerListaPartidasDisponibles=function(){
		let cli=this;
		$.getJSON("/obtenerPartidasDisponibles",function(lista){
			iu.mostrarListaDePartidasDisponibles(lista);
		});
	}
}