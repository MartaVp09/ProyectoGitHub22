function ClienteRest() {
    this.nick;

    this.agregarUsuario = function (nick) {
        var cli = this;
        $.getJSON("/agregarUsuario/" + nick, function (data) {          //Función de CallBack
            // Se ejecuta cuando ya haya contestado el servidor
            console.log(data);
            if (data.nick != -1) {
                console.log("Usuario "+data.nick+" registrado");
                cli.nick=data.nick;
                nick=data.nick;
                cli.obtenerListaPartidas();
                iu.mostrarHome(data.nick);
            }
            else {
                console.log("No se ha podido registrar el usuario");
                iu.mostrarAgregarUsuario();
                //iu.mostrarModal("El nick ya está en uso");
                //iu.mostrarAgregarJugador();
            }
        });
        // Todavía no estoy seguro de que haya contestado el servidor
        // Lo que pongas aquí se ejecuta a la vez que la llamada
    }

    this.crearPartida = function () {
        var cli = this;
        let nick = cli.nick;
        $.getJSON("/crearPartida/" + nick, function (data) {
            console.log(data);
            if (data.codigo != -1) {
                console.log("El usuario "+nick+" crea la partida: "+data.codigo);
                iu.mostrarCodigo(data.codigo);
            }
            else{
                console.log("El usuario "+nick+" no existe");
            }
        })
    }

    this.unirseAPartida = function (nick, codigo) {
        var cli = this;
        $.getJSON("/unirseAPartida/" + nick +"/" + codigo, function (data) {
            console.log(data);
            if (data.codigo != -1) {
                console.log("El usuario "+nick+" se ha unido a la partida: "+data.codigo);
            }
            else{
                console.log("El usuario "+nick+" no se ha podido unir a la partida: "+codigo);
            }
        })
    }

    this.obtenerListaPartidas = function () {
        var cli = this;
        //obtenerPartidasDisponibles
        $.getJSON("/obtenerPartidas", function (lista) {
            iu.mostrarListaDePartidas(lista);
        })
    }

}