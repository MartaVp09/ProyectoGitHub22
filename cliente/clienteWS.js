function ClienteWS() {
    this.socket;
    this.codigo;
    //enviar peticiones
    this.conectar = function () {
        this.socket = io();
        this.servidorWS();
    }
    this.crearPartida = function () {
        this.socket.emit("crearPartida", rest.nick);
    }
    this.unirseAPartida = function () {
        this.socket.emit("unirseAPartida", rest.nick, codigo);
    }
    this.abandonarPartida=function(){
		this.socket.emit("abandonarPartida",rest.nick,cws.codigo);
	}
    //gestionar peticiones
    this.servidorWS = function () {
        let cli = this;
        this.socket.on("partidaCreada", function (data) {
            if (data.codigo != -1) {
                console.log("El usuario " + rest.nick + " crea la partida: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo=data.codigo;
            } else {
                console.log("No se ha podido crear partida");
				iu.mostrarModal("No se ha podido crear partida");
				iu.mostrarCrearPartida();
            }
        });
        this.socket.on("unidoAPartida", function (data) {
            if (data.codigo != -1) {
                console.log("El usuario " + rest.nick + " se ha unido a la partida: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                cli.codigo = data.codigo;
            } else {
                console.log("El usuario " + rest.nick + " no se ha podido unir a la partida: " + data.codigo);
            }
        });
        this.socket.on("actualizarListaPartidas", function (lista) {
            if (!cli.codigo) {
                iu.mostrarListaDePartidasDisponibles(lista);
            }
        });
        this.socket.on("aJugar", function (lista) {
            iu.mostrarModal("A jugar!");
        })
    }

}

