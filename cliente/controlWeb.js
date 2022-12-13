function ControlWeb() {

	this.mostrarAgregarUsuario = function () {
		let cadena='<div id="mAU" class="container">';
		cadena=cadena+'<div class="jumbotron bg-primary">';
		cadena=cadena+'<h1 class="text-white">Batalla Naval</h1>';
		cadena=cadena+'<p style="color:white">La batalla naval es un juego tradicional de estrategia y algo de suerte, que involucra a dos participantes.</p>';
		cadena=cadena+'</div>';
		//cadena=cadena+'<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></input>';
		//cadena=cadena+'<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Iniciar sesión</button>';
		cadena=cadena+'<a href="/auth/google" class="btn btn-primary mb-2 mr-sm-2">Accede con Google</a>';
		cadena=cadena+'<div><center><img class="card-img-bottom" src="cliente/img/batallaNaval.webp" style="width:50% "></img></center></div>';
		cadena=cadena+'<div id="nota"></div>';
		cadena=cadena+'</div>';

		$('#grid human-player').hide();
		$('#mH').remove();
		$("#agregarUsuario").append(cadena);
		document.getElementById("tableros").style.visibility = "hidden";

		$("#btnAU").on("click", function (e) {
			if ($('#usr').val() === '' || $('#usr').val().length > 6) {
				e.preventDefault();
				$('#nota').append('Nick inválido');
			}
			else {
				var nick = $('#usr').val();
				$("#mAU").remove();
				rest.agregarUsuario(nick);
				//mostrar gif
			}
		})
	}
	this.mostrarHome = function () {
		$('#mH').remove();
	
		let cadena = '<div id="mH">';
		cadena=cadena+'<div class="jumbotron bg-primary">';
		cadena=cadena+'<h1 class="text-white">Bienvenid@ ' + rest.nick + '!</h1>';
		cadena=cadena+'</div>';
		cadena=cadena+'<div id="codigo"></div>';
		cadena=cadena+'<div class="row">';
		cadena=cadena+'<div class="col-sm-4">';
		cadena=cadena+'<button id="btnSalir" class="btn btn-primary mb-2 mr-sm-2" style="margin-top:10px">Salir</button>';
		cadena=cadena+'<div id="abandonar"></div>';
		cadena=cadena+'<div id="mCP"></div>';
		cadena=cadena+'</div>';
		cadena=cadena+'<div id="mLP" class="col-sm-8">';
		cadena=cadena+'</div></div>';

		$('#agregarUsuario').append(cadena);
		document.getElementById("tableros").style.visibility = "hidden";

		this.mostrarCrearPartida();
		rest.obtenerListaPartidasDisponibles();

		$("#btnSalir").on("click", function (e) {
			$("#mCP").remove();
			$('#mLP').remove();
			$('#mH').remove();
			$.removeCookie("nick");
			iu.comprobarCookie();
			rest.salir();
		});
	}
	this.mostrarCrearPartida = function () {
		let cadena = '<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear partida</button>';
	
		$('#mCP').append(cadena);
		document.getElementById("tableros").style.visibility = "hidden";

		$("#btnCP").on("click", function (e) {
			$("#mCP").remove();
			$('#mLP').remove();
			iu.mostrarAbandonarPartida();
			cws.crearPartida();
		});
	}

	this.mostrarCodigo = function (codigo) {
		let cadena = "Código de la partida: " + codigo;

		$('#codigo').append(cadena);
		document.getElementById("tableros").style.visibility = "visible";
	}

	this.mostrarAbandonarPartida = function () {
		let cadena = '<button id="btnAbandonar" class="btn btn-primary mb-2 mr-sm-2" style="margin-top:10px">Abandonar partida</button>';

		$('#abandonar').append(cadena);

		$("#btnAbandonar").on("click", function (e) {
			$('#codigo').remove();
			$('#mH').remove();
			iu.mostrarHome();
			cws.abandonarPartida();
		});
	}
	this.mostrarListaDePartidasDisponibles = function (lista) {
		$('#mListaP').remove();
		let cadena = '<div id="mListaP">'
		cadena=cadena+'<h2>Lista de partidas disponibles</h2>';

		cadena = cadena + '<ul class="list-group">';
		for (i = 0; i < lista.length; i++) {
			cadena = cadena + '<li class="list-group-item"><a href="#" value="' + lista[i].codigo + '"> Nick propietario: ' + lista[i].owner + '</a></li>';
		}
		cadena = cadena + "</ul>";

		cadena = cadena + '<button id="btnAL" class="btn btn-primary mb-2 mr-sm-2" style="margin-top:10px">Actualizar</button>';
		cadena = cadena + "</div></div>"

		$('#mLP').append(cadena);

		$(".list-group a").click(function () {
			codigo = $(this).attr("value");
			if (codigo) {
				$('#mLP').remove();
				$('#mCP').remove();
				cws.unirseAPartida(codigo);
			}
		});
		$("#btnAL").on("click", function (e) {
			rest.obtenerListaPartidasDisponibles();
		})
	}

	this.comprobarCookie = function () {
		if ($.cookie("nick")) {
			rest.nick = $.cookie("nick");
			rest.comprobarUsuario();
		}
		else {
			this.mostrarAgregarUsuario();
		}
	}

	this.mostrarModal = function (msg) {
		$('#mM').remove();
		var cadena = "<p id='mM'>" + msg + "</p>";
		$('#contenidoModal').append(cadena);
		$('#miModal').modal("show");
	}

	this.finPartida = function () {
		$('#codigo').remove();
		$('#abandonar').remove();
		$('#btnCP').remove();
		$('#mLP').remove();
		$('#mH').remove();

		$.removeCookie("nick");
		iu.comprobarCookie();
		rest.salir();
	}
}