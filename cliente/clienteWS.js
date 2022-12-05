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
            //iu.mostrarModal("Barco colocado!");
            if(res.colocado){
                let barco = tablero.flota[res.nombre];
                tablero.puedesColocarBarco(barco, res.x, res.y);
                cli.barcosDesplegados();
            }else{
                iu.mostrarModal("No se puede colocar barco")
            }
        })

        this.socket.on("aJugar", function (rest) {
            let mensaje = "Flotas desplegadas y turno asignado! A disparaar!";  
            iu.mostrarModal(mensaje);
        })

        this.socket.on("esperandoRival", function (res) {
            let mensaje = "Aún no puedes colocar barcos! Esperando rival...";  
            iu.mostrarModal(mensaje);
        })

        this.socket.on("disparar", function (res) {
            let accion;
            
            if(res.estado=="agua"){
                accion="¡Aguuua!";
            }else if(res.estado=="tocado"){
                accion="¡Tooocadoo!";
            }else {
                accion="¡Huuundido";
            }

            let mensaje = "Disparo: "+res.disparo+ " Acción: "+accion+" Turno de: "+res.turno; 
            iu.mostrarModal(mensaje);
            if(res.turnoAnterior==rest.nick){
                tablero.puedesDisparar( res.disparo[1], res.disparo[3], res.estado, "computer-player");
            }else{
                tablero.puedesDisparar( res.disparo[1], res.disparo[3], res.estado, "human-player");
            }
        })

        this.socket.on("noEsTuTurno", function (res) {
            let mensaje = "No es tu turno"
            iu.mostrarModal(mensaje);
        })

        this.socket.on("faseDesplegando", function (res) {
            tablero.flota=res;
            tablero.elementosGrid();
            tablero.mostrarFlota();
            let mensaje = "Ya puedes desplegar tus barcos!";  
            iu.mostrarModal(mensaje);
        })

        this.socket.on("finPartida", function(res){
            iu.mostrarModal("Fin de la partida, Ganador: "+res.turno);
            iu.finPartida();
        })
    }

}

