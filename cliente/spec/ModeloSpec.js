describe("El juego...", function() {
  var miJuego;
  var user1,user2;

  beforeEach(function() {
    miJuego=new Juego();
	miJuego.agregarUsuario("pepe");
	miJuego.agregarUsuario("luis");
	user1=miJuego.usuarios["pepe"];
	user2=miJuego.usuarios["luis"];
  });

  it("inicialmente", function() {
	let lista=miJuego.obtenerPartidas();
    expect(lista.length).toEqual(0);
	expect(user1.nick).toEqual("pepe");
	expect(user2.nick).toEqual("luis");
  });
  
  
  it("Crear partida", function() {
	let codigo=user1.crearPartida();
	expect(miJuego.partidas[codigo]).toBeDefined();    //Comprueba que existe
	let partida=miJuego.partidas[codigo];
	expect(partida.owner.nick).toEqual(user1.nick);
	expect(partida.jugadores[0].nick).toEqual(user1.nick);
	expect(partida.codigo).toEqual(codigo);
  });
  
  xit("El usuario luis se une a la partida", function(){
	  let codigo=miJuego.partidas[0].codigo;
	  user2.unirseAPartida(codigo);
	  let partida=miJuego.partidas[codigo];
	  expect(partida.jugadores[1].nick).toEqual(user2.nick);
  }
  
  
});
