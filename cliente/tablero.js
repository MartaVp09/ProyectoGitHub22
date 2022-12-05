function Tablero() {

    this.placingOnGrid = false;
    this.nombreBarco = undefined;
    this.flota;

    this.init = function () {
        //inicilizar los manejadores
        var humanCells = document.querySelector('.human-player').childNodes;
        for (var k = 0; k < humanCells.length; k++) {
            humanCells[k].self = this;
            humanCells[k].addEventListener('click', this.placementListener, false);
        }

        var computerCells = document.querySelector('.computer-player').childNodes;
        for (var j = 0; j < computerCells.length; j++) {
            computerCells[j].self = this;
            computerCells[j].addEventListener('click', this.shootListener, false);
        }
    }

    this.asignarFlotaListener=function(){
        var playerRoster = document.querySelector('.fleet-roster').querySelectorAll('li');
        for (var i = 0; i < playerRoster.length; i++) {
            playerRoster[i].self = this;
            playerRoster[i].addEventListener('click', this.rosterListener, false);
        }
    }

    this.placementListener = function (e) {
        var self = e.target.self;
        if (self.placingOnGrid) {
            // Extract coordinates from event listener
            var x = parseInt(e.target.getAttribute('data-x'), 10);
            var y = parseInt(e.target.getAttribute('data-y'), 10);
            self.colocarBarco(self.nombreBarco, x, y);
        }
    };

    this.endPlacing = function (shipType) {
        document.getElementById(shipType).setAttribute('class', 'placed');
        self.placingOnGrid = false;
    };

    this.rosterListener = function (e) {
        var self = e.target.self;
        // Remove all classes of 'placing' from the fleet roster first
        var roster = document.querySelectorAll('.fleet-roster li');
        for (var i = 0; i < roster.length; i++) {
            var classes = roster[i].getAttribute('class') || '';
            classes = classes.replace('placing', '');
            roster[i].setAttribute('class', classes);
        }

        // Set the class of the target ship to 'placing'
        self.nombreBarco = e.target.getAttribute('id');
        document.getElementById(self.nombreBarco).setAttribute('class', 'placing');
        self.placingOnGrid = true;
    };

    this.colocarBarco = function (nombre, x, y) {
        console.log("Barco: " + nombre + " X: " + x + " Y: " + y);
        cws.colocarBarco(nombre, x, y);
    }

    this.puedesColocarBarco = function (barco, x, y) {  
        for (i = 0; i < barco.tam; i++) {
            this.updateCell(x + i, y, "ship", "human-player")
        }
        this.endPlacing(barco.nombre);
    }

    this.shootListener = function (e) {
        // Extract coordinates from event listener
        var x = parseInt(e.target.getAttribute('data-x'), 10);
        var y = parseInt(e.target.getAttribute('data-y'), 10);

        cws.disparar(x, y);
    };

    // Updates the cell's CSS class based on the type passed in
    this.updateCell = function (x, y, type, targetPlayer) {
        var player = targetPlayer;
        var classes = ['grid-cell', 'grid-cell-' + x + '-' + y, 'grid-' + type];
        document.querySelector('.' + player + ' .grid-cell-' + x + '-' + y).setAttribute('class', classes.join(' '));
    };

    this.createGrid = function () {
        var gridDiv = document.querySelectorAll('.grid');

        for (var grid = 0; grid < gridDiv.length; grid++) {
            let myNode = gridDiv[grid];
            while (myNode.lastElementChild) {
                myNode.removeChild(myNode.lastElementChild);
            }
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var el = document.createElement('div');
                    el.setAttribute('data-x', j);
                    el.setAttribute('data-y', i);
                    el.setAttribute('class', 'grid-cell grid-cell-' + j + '-' + i);
                    gridDiv[grid].appendChild(el);
                }
            }
        }
        this.init();
    };

    this.elementosGrid = function () {
        $('#gc').remove();
        let cadena='<div class="game-container" id="gc">';
        cadena = cadena + '<div class="row">';
        cadena = cadena + '<div class="col-4">';
        cadena = cadena + '<h2>Barcos</h2>';
        cadena = cadena + '<div id=flota></div>';
        cadena = cadena + '</div>';
        cadena = cadena + '<div class="col-8">';
        cadena = cadena + '<div class="grid-container">';
        cadena = cadena + '<h2>Tu flota</h2><div class="grid human-player"></div>';
        cadena = cadena + '</div>';
        cadena = cadena + '<div class="grid-container">';
        cadena = cadena + '<h2>Flota enemiga<h2><div class="grid computer-player"></div>';
        cadena = cadena + '</div></div></div></div>';

        $('#tableros').append(cadena);
        this.createGrid();
    }

    this.mostrarFlota = function () {
        $("#listaF").remove();
        let cadena = '<ul class="fleet-roster" id="listaF">';
        for (let key in this.flota) {
            cadena = cadena + "<li id='" + key + "'>" + key + "</li>"
        }
        cadena = cadena + "</ul>";
        $('#flota').append(cadena);
        this.asignarFlotaListener();
    }

    this.puedesDisparar = function (x, y, estado, targetPlayer) {

        if (estado == "agua") {
            this.updateCell(x, y, 'miss', targetPlayer);
        } else if (estado == "tocado") {
            this.updateCell(x, y, 'hit', targetPlayer);
        } else if (estado == "hundido") {
            this.updateCell(x, y, 'sunk', targetPlayer);
        }

    }

    this.shootListener = function (e) {
        // Extract coordinates from event listener
        var x = parseInt(e.target.getAttribute('data-x'), 10);
        var y = parseInt(e.target.getAttribute('data-y'), 10);

        cws.disparar(x, y);
    };

}