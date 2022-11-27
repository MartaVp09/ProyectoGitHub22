function ServidorWS() {
    //enviar peticiones
    this.enviarAlRemitente=function (socket, mensaje, datos){
        socket.emit(mensaje,datos);
    }
    //Se envia un mensaje a los usuarios que están en esa partida
    this.enviarATodosEnPartida=function(io,codigo,mensaje,datos){
        console.log(datos);
        io.sockets.in(codigo).emit(mensaje,datos);
    }
    this.enviarATodos=function(socket,mens,datos){
        socket.broadcast.emit(mens,datos);
    }
    //gestionar peticiones
    this.lanzarServidorWS = function (io, juego) {
        let cli = this;
        io.on('connection', (socket) => {
            console.log('Usuario conectado.');

            socket.on("crearPartida", function(nick){
                let res = juego.jugadorCreaPartida(nick);
                let codigoStr = res.codigo.toString();
                console.log(res);
                socket.join(codigoStr);
                cli.enviarATodosEnPartida(io,codigoStr,"partidaCreada",res)
                let lista=juego.obtenerPartidasDisponibles();
                cli.enviarATodos(socket,"actualizarListaPartidas", lista);
            });

            socket.on("unirseAPartida",function(nick, codigo){
                let codigoStr=codigo.toString();
			  	socket.join(codigoStr);
			  	let res = juego.jugadorSeUneAPartida(nick,codigo);		  	
			  	cli.enviarAlRemitente(socket,"unidoAPartida",res);		  	
			  	let partida=juego.obtenerPartida(codigo);
                let user = juego.obtenerUsuario(nick)
                let flota = user.obtenerFlota();
                console.log(flota);
                if(partida.esDesplegando()){
                    cli.enviarATodosEnPartida(io,codigoStr,"faseDesplegando",{"b2":flota['b2'],"b4":flota['b4']});
                }
            })

            socket.on("abandonarPartida", function(nick, codigo){
                juego.eliminarPartida(codigo);
                let codigoStr=codigo.toString();
			  	socket.join(codigoStr);
                cli.enviarATodosEnPartida(io,codigoStr,"abandonarPartida", {});
            });

            socket.on("colocarBarco",function(nick, nombre, x, y){
                let us = juego.obtenerUsuario(nick)
                if(us && us.partida){
                    us.colocarBarco(nombre,x,y);
                    cli.enviarAlRemitente(socket,"barcosColocados",{"nick": nick, "x":x, "y":y, "colocado":true, "nombre":nombre});	
                }
            })
            socket.on("barcosDesplegados",function(nick){
                let res = juego.usuarios[nick].barcosDesplegados();
                let user = juego.obtenerUsuario(nick)
                if(user.partida){
                    let codigoStr = user.partida.codigo.toString()
                    if(user.partida.flotasDesplegadas()){
                        cli.enviarATodosEnPartida(io,codigoStr,"barcosDesplegados",res)
                    }else{
                        cli.enviarAlRemitente(socket,"esperandoRival",res)
                    }
                }
            })
            socket.on("disparar",function(nick, x, y){
                let us = juego.obtenerUsuario(nick)
                let res;
                if(us){
                    if (us.partida.turno.nick!=us.nick){
                        cli.enviarAlRemitente(socket,"noEsTuTurno",{});
                        us.disparar(x,y);
                    }else{
                        let estado = us.tableroPropio.casillas[x][y].contiene.obtenerEstado();
                        
                        if(estado == "agua"){
                            res = { disparo: "("+x+","+y+")", estado: "¡Aguuua!", turno:  us.partida.turno.nick }
                        }else if(estado == "intacto"){
                            res = { disparo: "("+x+","+y+")", estado: "¡Tocaaado!", turno:  us.partida.turno.nick }
                        }else{
                            res = { disparo: "("+x+","+y+")", estado: "¡Hundidoo!", turno:  us.partida.turno.nick }
                        }
                        
                        us.disparar(x,y);
                        cli.enviarATodosEnPartida(io,us.partida.codigo.toString(),"disparar",res)
                        if(us.partida.fase=="final"){
                            cli.enviarATodosEnPartida(io,us.partida.codigo.toString(),"finPartida",res)
                        }
                    }
                }
            })
        });
    }
}

module.exports.ServidorWS = ServidorWS;