var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var app = express();
app.use(express.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.json());
app.use(cors());

//Establecemos los prámetros de conexión
var conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'arduino'
});

//Conexión a la database
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("¡Conexión exitosa a la base de datos!");
    }
});

// Ruta predifinida
app.get('/', function(req,res){
    res.send('Ruta INICIO');
});

//Mostrar todos los datos del entorno
app.get('/api/entorno', (req, res)=>{
    conexion.query('SELECT * FROM entorno', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

// Mostrar todos los datos de los dispositivos
app.get('/api/dispositivos', (req, res)=>{
    conexion.query('SELECT * FROM dispositivos', (error, filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

// Mostrar todos los datos de los usuarios
app.get('/api/usuarios', (req, res)=>{
    conexion.query('SELECT * FROM usuarios', (error, filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

// Inserta un nuevo registro de temperatura y humedad
app.post('/api/th/new', (req, res) => {
    let data = {
        temperatura: req.body.temperatura,
        humedad: req.body.humedad,
        fecha: new Date() // Cambiado a new Date() para obtener la fecha actual
    };
    let sql = "INSERT INTO entorno SET ?";
    conexion.query(sql, data, function(error, results) {
        if (error) {
            // Enviar un código de estado 500 en caso de error interno del servidor
            return res.status(500).send({ error: "Error al insertar el registro en la base de datos" });
        } else {
            // Enviar un código de estado 200 y los resultados en caso de éxito
            return res.status(200).send(results);
        }
    });
});

// Inserta un nuevo registro de usuario
app.post('/api/add/usuarios', (req, res) => {
    let data = {
        email: req.body.email,
        password: req.body.password
    };
    let sql = "INSERT INTO usuarios SET ?";
    conexion.query(sql, data, function(error, results) {
        if (error) {
            // Enviar un código de estado 500 en caso de error interno del servidor
            return res.status(500).send({ error: "Error al insertar el registro en la base de datos" });
        } else {
            // Enviar un código de estado 200 y los resultados en caso de éxito
            return res.status(200).send(results);
        }
    });
});

// Inserta un nuevo registro de un dispositivo
app.post('/api/add/dispositivos', (req, res) => {
    let data = {
        dispositivo: req.body.dispositivo,
        mac: req.body.mac,
        rssi: req.body.rssi,
        x: req.body.x,
        y: req.body.y
    };
    let sql = "INSERT INTO dispositivos SET ?";
    conexion.query(sql, data, function(error, results) {
        if (error) {
            // Enviar un código de estado 500 en caso de error interno del servidor
            return res.status(500).send({ error: "Error al insertar el registro en la base de datos" });
        } else {
            // Enviar un código de estado 200 y los resultados en caso de éxito
            return res.status(200).send(results);
        }
    });
});

// Editar los valores el entorno
app.put('/api/edit/entorno/:id', (req, res)=>{
    let id = req.params.id;
    let temperatura = req.body.temperatura;
    let humedad = req.body.humedad;
    let sql = "UPDATE entorno SET temperatura = ?, humedad = ? WHERE id = ?";
    conexion.query(sql, [temperatura, humedad, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

// Editar los valores de Usuario
app.put('/api/edit/usuario/:id', (req, res)=>{
    let id = req.params.id;
    let email = req.body.email;
    let password = req.body.password;
    let sql = "UPDATE usuarios SET email = ?, password = ? WHERE id = ?";
    conexion.query(sql, [email, password, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

// Editar los valores del sispositivo
app.put('/api/edit/dispositivos/:id', (req, res)=>{
    let id = req.params.id;
    let dispositivo = req.body.dispositivo;
    let mac = req.body.mac;
    let x = req.body.x;
    let y = req.body.y;
    let sql = "UPDATE dispositivos SET dispositivo = ?, mac = ?, rssi = ?, x = ?, y = ? WHERE id = ?";
    conexion.query(sql, [dispositivo, mac, x, y, id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

// no creo que utilicemos esta funcion en ninguna de las tablas
app.delete('/api/delete/dispositivos/:id', (req, res)=> {
    conexion.query('DELETE FROM dispositivos WHERE id = ?', [req.params.id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

// no creo que utilicemos esta funcion en ninguna de las tablas
app.delete('/api/delete/entorno/:id', (req, res)=> {
    conexion.query('DELETE FROM entorno WHERE id = ?', [req.params.id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

app.delete('/api/delete/usuario/:id', (req, res)=> {
    conexion.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], function(error, results){
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    });
});

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, function(){
    console.log("Servidor Ok en puerto:"+puerto);
});