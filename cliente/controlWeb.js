function ControlWeb() {
    
    this.mostrarAgregarUsuario = function () {
        var cadena = '<div class="row" id="mAU">';
        cadena = cadena + '<div class="row"><h2>El juego indefinido</h2></div>';
        cadena = cadena + '<div class="row">';
        cadena = cadena + '<div class="col">'
        cadena = cadena + '<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></div>';
        cadena = cadena + '<div class="col">';
        cadena = cadena + '<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Iniciar sesión</button>';
        //cadena=cadena+'<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';

        cadena = cadena + '</div>'; //' </form>';
        cadena = cadena + '<div id="nota"></div></div></div>';

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

        $("#agregarUsuario").append(cadena);

    }
    this.mostrarCrearPartida = function () {
        // Dibujar un botón, que al hacer click llame a crear
        // partida de rest
        var usuario = rest.nick;
        var cadena = '<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Crear partida</button>';

    }

    this.mostrarListaDePartidas = function (lista) {
        // Crear un control visual tipo lista para mostrar 
        // la lista de partidas
        // y permitir unirse
    }

}