function ControlWeb() {

    this.mostrarAgregarUsuario = function () {
        var cadena = '<div class="row" id="mAU">';
        cadena = cadena + '<h2>El juego indefinido</h2>';
        cadena = cadena + '<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required>';
        cadena = cadena + '<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Iniciar sesión</button>';
        cadena = cadena + '<div id="nota"></div></div>';

        $("#agregarUsuario").append(cadena);
        //$("#nota").append("<div id='aviso' style='text-align:right'>Inicia sesión con Google para jugar</div>");    

        $("#btnAU").on("click", function (e) {
            if ($('#usr').val() === '' || $('#usr').val().length > 6) {
                e.preventDefault();
                $('#nota').append('Nick inválido');
            }
            else {
                var nick = $('#usr').val();
                $("#mAU").remove();
                $("#aviso").remove();
                rest.agregarUsuario(nick);
                //mostrar gif de ruleta
            }
        })
    }

    this.mostrarHome = function (nick) {
        $("#mH").remove();
        var usuario = nick;
        var cadena = "<div id='mH'><h2>Bienvenido ";
        cadena = cadena + usuario;
        cadena = cadena + "!</h2></div>";
        cadena = cadena + "<div id=codigo></div>";

        $("#agregarUsuario").append(cadena);
        this.mostrarCrearPartida();

    }

    this.mostrarCodigo = function (codigo) {
        var cadena = "Código de la partida: " + codigo;
        $("#codigo").append(cadena);
    }

    this.mostrarCrearPartida = function () {
        // Dibujar un botón, que al hacer click llame a crear
        // partida de rest
        $("#mCP").remove();
        var cadena = '<div class="row" id="mCP">';
        cadena = cadena + '<div class="col">'
        cadena = cadena + '<button id="btnCP" class="btn btn-primary">Crear partida</button>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div>';

        $("#crearPartida").append(cadena);
        $("#btnCP").on("click", function (e) {
            $("#mCP").remove();
            rest.crearPartida();
        });

    }

    this.mostrarListaDePartidas = function (lista) {
        // Crear un control visual tipo lista para mostrar 
        // la lista de partidas
        // y permitir unirse
        $("#mLDP").remove();
        //var cadena = '<div class="row" id=mLDP>';
        cadena = '<h2>Lista de partidas:</h2>';
        cadena = cadena + '<ul class="list-group border-top" style="margin-top: 10px;">';

        for (i = 0; i < lista.length; i++) {
            cadena = cadena + '<li class="list-group-item">'+lista[i].codigo+' Propietario: '+lista[i].owner+'</li>';
        }
        
        cadena = cadena + '</ul>';
        cadena = cadena + '</div>';

        $("#listaPartidas").append(cadena);
    }

}