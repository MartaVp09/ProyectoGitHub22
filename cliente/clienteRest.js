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
				iu.mostrarHome();
			}
			else{
				console.log("No se ha podido registrar el usuario")
				iu.mostrarModal("El nick ya está en uso");
				iu.mostrarAgregarUsuario();
			}
		});
	}
	this.crearPartida=function(){
		let cli=this;
		let nick=cli.nick;
		$.getJSON("/crearPartida/"+nick,function(data){
			console.log(data);
			if (data.codigo!=-1){
				console.log("Usuario "+nick+" crea partida codigo: "+data.codigo)
				iu.mostrarCodigo(data.codigo);
			}
			else{
				console.log("No se ha podido crear partida")
			}
		});
	}
	this.unirseAPartida=function(codigo){
		let cli=this;
		$.getJSON("/unirseAPartida/"+this.nick+"/"+codigo,function(data){
			//se ejecuta cuando conteste el servidor
			if (data.codigo!=-1){
				console.log("Usuario "+cli.nick+" se une a partida codigo: "+data.codigo);
				iu.mostrarCodigo(data.codigo);
			}
			else{
				console.log("No se ha podido unir a partida")
			}
		});
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

	this.obtenerListaPartidas=function(){
		let cli=this;
		$.getJSON("/obtenerPartidas",function(lista){
			console.log(lista);
			iu.mostrarListaDePartidas(lista);
		});
	}
	this.obtenerListaPartidasDisponibles=function(){
		let cli=this;
		$.getJSON("/obtenerPartidasDisponibles",function(lista){
			console.log(lista);
			iu.mostrarListaDePartidasDisponibles(lista);
		});
	}
}