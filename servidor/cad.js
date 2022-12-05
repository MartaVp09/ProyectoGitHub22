var mongo = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;

function Cad() {
    this.logs;

    //partidas
    this.insertarLog = function (registroLog, callback) {
        insertar(this.logs, registroLog, callback);
    }

    this.obtenerLogs = function(callback){
        obtenerTodos(this.logs,callback);
    }

   //insertar
    function insertar(coleccion, elemento, callback) {
        coleccion.insertOne(elemento, function (err, result) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });
    }

    //obtener
    function obtenerTodos(coleccion,callback){
        coleccion.find().toArray(function(error,col){
            callback(col);
        });
    };

    this.conectar = function () {
        let cad = this;
        mongo.connect("mongodb+srv://marta:mqYoEMzVUawtuGpG@cluster0.gt6w4j7.mongodb.net/?retryWrites=true&w=majority", { useUnifiedTopology: true }, function (err, database) {
            if (!err) {
                console.log("Conectado a MongoDB Atlas");
                database.db("marta").collection("logs", function (err, col) {
                    if (err) {
                        console.log("No se puede obtener la coleccion")
                    }
                    else {
                        console.log("Tenemos la colección de logs");
                        cad.logs = col;
                    }
                });
            } else {
                console.log("No se pudo conectar con MongoDB Atlas")
            }
        });
    }
    
    //this.conectar();
}

module.exports.Cad = Cad;