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
    this.salir=function(){
        this.socket.emit("salir", rest.nick);
    }
    this.colocarBarco=function(nombre,x,y){
        this.socket.emit("colocarBarco", rest.nick, nombre, x, y);
    }
    this.barcosDesplegados=function() {
        this.socket.emit("barcosDesplegados", rest.nick);
    }
    this.disparar=function(x,y){
        this.socket.emit("disparar", rest.nick, x, y);
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
                rest.comprobarUsuario();
            }
        });
        
        this.socket.on("unidoAPartida", function (data) {
            if (data.codigo != -1) {
                console.log("El usuario " + rest.nick + " se ha unido a la partida: " + data.codigo);
                iu.mostrarCodigo(data.codigo);
                iu.mostrarAbandonarPartida();
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
        
        this.socket.on("barcosColocados", function (res) {
            iu.mostrarModal("Barco colocado!");
            if(res.colocado){
                let barco = tablero.flota[res.nombre];
                tablero.puedesColocarBarco(barco, res.x, res.y);
            }else{
                iu.mostrarModal("No se puede colocar barco")
            }
        })

        this.socket.on("barcosDesplegados", function (rest) {
            let mensaje = "Flotas desplegadas y turno asignado! A disparaar!";  
            iu.mostrarModal(mensaje);
        })

        this.socket.on("esperandoRival", function (rest) {
            iu.mostrarModal(rest);
        })

        this.socket.on("disparar", function (res) {
            let mensaje = "Disparo: "+res.disparo+ " Acción: "+res.estado+" Turno de: "+res.turno; 
            iu.mostrarModal(mensaje);
        })

        this.socket.on("noEsTuTurno", function (res) {
            let mensaje = "No es tu turno"
            iu.mostrarModal(mensaje);
        })

        this.socket.on("faseDesplegando", function (res) {
            console.log(res);
            tablero.flota=res;
        })

        this.socket.on("finPartida", function(res){
            iu.mostrarModal("Fin de la partida, Ganador: "+res.turno);
            iu.finPartida();
        })
    }

}

