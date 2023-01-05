function ServidorWS() {
    //enviar peticiones
    this.enviarAlRemitente = function (socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    }
    //Se envia un mensaje a los usuarios que están en esa partida
    this.enviarATodosEnPartida = function (io, codigo, mensaje, datos) {
        io.sockets.in(codigo).emit(mensaje, datos);
    }
    this.enviarATodos = function (socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    }
    //gestionar peticiones
    this.lanzarServidorWS = function (io, juego) {
        let cli = this;
        io.on('connection', (socket) => {
            console.log('Usuario conectado.');

            socket.on("crearPartida", function (nick) {
                let res = juego.jugadorCreaPartida(nick);
                let codigoStr = res.codigo.toString();
                console.log(res);
                socket.join(codigoStr);
                cli.enviarATodosEnPartida(io, codigoStr, "partidaCreada", res)
                let lista = juego.obtenerPartidasDisponibles();
                cli.enviarATodos(socket, "actualizarListaPartidas", lista);
            });

            socket.on("unirseAPartida", function (nick, codigo) {
                let codigoStr = codigo.toString();
                socket.join(codigoStr);
                let res = juego.jugadorSeUneAPartida(nick, codigo);
                cli.enviarAlRemitente(socket, "unidoAPartida", res);
                let partida = juego.obtenerPartida(codigo);
                let user = juego.obtenerUsuario(nick)
                let flota = user.obtenerFlota();
                if (partida.esDesplegando()) {
                    cli.enviarATodosEnPartida(io, codigoStr, "faseDesplegando", { "b2": flota['b2'], "b3": flota['b3'], "b4": flota['b4'], "b5": flota['b5'] });
                }
            })

            socket.on("abandonarPartida", function (nick, codigo) {
                juego.eliminarPartida(codigo);
                let codigoStr = codigo.toString();
                socket.join(codigoStr);
                cli.enviarATodosEnPartida(io, codigoStr, "abandonarPartida", {});
            });

            socket.on("colocarBarco", function (nick, nombre, x, y, orientacion) {
                let us = juego.obtenerUsuario(nick)
                if (us && us.partida && us.partida.esDesplegando()) {
                    let colocado= us.colocarBarco(nombre, x, y, orientacion);
                    cli.enviarAlRemitente(socket, "barcosColocados", { "nick": nick, "x": x, "y": y, "colocado": colocado, "nombre": nombre });
                }
            })
            socket.on("barcosDesplegados", function (nick) {
                let res = juego.usuarios[nick].barcosDesplegados();
                let user = juego.obtenerUsuario(nick);
                if (user.partida) {
                    let codigoStr = user.partida.codigo.toString()
                    if (user.partida.flotasDesplegadas()) {
                        cli.enviarATodosEnPartida(io, codigoStr, "aJugar", res)
                    }
                }
            })
            socket.on("disparar", function (nick, x, y) {
                let us = juego.obtenerUsuario(nick)
                let res;
                if (us.partida.flotasDesplegadas()) {
                    if (us.partida.turno.nick != us.nick) {
                        cli.enviarAlRemitente(socket, "noEsTuTurno", {});
                        us.disparar(x, y);
                    } else {
                        let turnoAnterior = us.partida.turno.nick;
                        us.disparar(x, y);
                        let estado = us.obtenerEstadoMarcado(x, y);

                        res = { disparo: "(" + x + "," + y + ")", estado: estado, turno: us.partida.turno.nick, turnoAnterior: turnoAnterior }

                        cli.enviarATodosEnPartida(io, us.partida.codigo.toString(), "disparar", res)
                        if (us.partida.fase == "final") {
                            cli.enviarATodosEnPartida(io, us.partida.codigo.toString(), "finPartida", res)
                        }
                    }
                }
            })
        });
    }
}

module.exports.ServidorWS = ServidorWS;