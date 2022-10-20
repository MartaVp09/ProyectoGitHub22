function ControlWeb(){
	this.comprobarCookie=function(){
		if ($.cookie("nick")){
			rest.nick=$.cookie("nick");
			this.mostrarHome();
		}
		else{
			this.mostrarAgregarUsuario();
		}
	}
	this.mostrarAgregarUsuario=function(){
		let cadena= '<div class="row" id="mAU">';//'<form class="form-row needs-validation"  id="mAJ">';
		cadena=cadena+"<div class='col'>";
		cadena=cadena+'<div class="row"><div class="col"><h2>El juego indefinido</h2></div></div>';
		cadena=cadena+'<div class="row">';
		cadena=cadena+'<div class="col">'
        cadena=cadena+'<input type="text" class="form-control mb-2 mr-sm-2" id="usr" placeholder="Introduce tu nick (max 6 letras)" required></div>';
        cadena=cadena+'<div class="col">';
        cadena=cadena+'<button id="btnAU" class="btn btn-primary mb-2 mr-sm-2">Iniciar sesión</button>';
        cadena=cadena+'</div>';
        cadena=cadena+'<div id="nota"></div>';
        cadena=cadena+'</div></div></div>';

		$("#agregarUsuario").append(cadena);     
		//$("#nota").append("<div id='aviso' style='text-align:right'>Inicia sesión con Google para jugar</div>");    

		$("#btnAU").on("click",function(e){
			if ($('#usr').val() === '' || $('#usr').val().length>6) {
			    e.preventDefault();
			    $('#nota').append('Nick inválido');
			}
			else{
				var nick=$('#usr').val();
				$("#mAU").remove();
				//$("#aviso").remove();
				rest.agregarUsuario(nick);
				//mostrar gif
			}
		})
	}
	this.mostrarHome=function(){
		$('#mH').remove();
		let cadena="<div class='row' id='mH'>";
		cadena=cadena+'<div class="col">';
		cadena=cadena+"<h2>Bienvenido "+rest.nick+"</h2>";
		cadena=cadena+"<div id='codigo'></div>"
		cadena=cadena+'<button id="btnSalir" class="btn btn-primary mb-2 mr-sm-2" style="margin-top:10px">Salir</button>';
		cadena=cadena+"</div></div>";
		$('#agregarUsuario').append(cadena);
		this.mostrarCrearPartida();
		rest.obtenerListaPartidasDisponibles();
		$("#btnSalir").on("click",function(e){		
			$("#mCP").remove();
			$('#mLP').remove();
			$('#mH').remove();
			$.removeCookie("nick");
			iu.comprobarCookie();
		});
	}
	this.mostrarCrearPartida=function(){
		$('#mCP').remove();
		let cadena= '<div class="row" id="mCP">';
        cadena=cadena+'<div class="col">';
        cadena=cadena+'<button id="btnCP" class="btn btn-primary mb-2 mr-sm-2">Crear partida</button>';
        cadena=cadena+'</div>';
        cadena=cadena+'</div>';
        $('#crearPartida').append(cadena);
        $("#btnCP").on("click",function(e){		
			$("#mCP").remove();
			rest.crearPartida();
		});
	}
	this.mostrarCodigo=function(codigo){
		let cadena="Código de la partida: "+codigo;
		$('#codigo').append(cadena);
	}
	this.mostrarListaDePartidas=function(lista){
		$('#mLP').remove();
		let cadena="<div id='mLP'>";		
		cadena=cadena+'<ul class="list-group">';
		for(i=0;i<lista.length;i++){
		  cadena = cadena+'<li class="list-group-item">'+lista[i].codigo+' propietario: '+lista[i].owner+'</li>';
		}
		cadena=cadena+"</ul>";
		cadena=cadena+"</div>"
		$('#listaPartidas').append(cadena);
		
	}
	this.mostrarListaDePartidasDisponibles=function(lista){
		$('#mLP').remove();
		let cadena="<div class='row' id='mLP'>";
		cadena=cadena+"<div class='col'>";
		cadena=cadena+"<h2>Lista de partidas disponibles</h2>";
		
		cadena=cadena+'<ul class="list-group">';
		for(i=0;i<lista.length;i++){
		  cadena = cadena+'<li class="list-group-item"><a href="#" value="'+lista[i].codigo+'"> Nick propietario: '+lista[i].owner+'</a></li>';
		}
		cadena=cadena+"</ul>";

		cadena=cadena+'<button id="btnAL" class="btn btn-primary mb-2 mr-sm-2" style="margin-top:10px">Actualizar</button>';
		cadena=cadena+"</div></div>"
		$('#listaPartidas').append(cadena);

		$(".list-group a").click(function(){
	        codigo=$(this).attr("value");
   	        console.log(codigo);
	        if (codigo){
	            $('#mLP').remove();
	            $('#mCP').remove();
	            rest.unirseAPartida(codigo);
	        }
	    });		
	    $("#btnAL").on("click",function(e){		
			rest.obtenerListaPartidasDisponibles();
		})
	}
	this.mostrarModal=function(msg){
		$('#mM').remove();
		var cadena="<p id='mM'>"+msg+"</p>";
		$('#contenidoModal').append(cadena);
		$('#miModal').modal("show");
	}
}