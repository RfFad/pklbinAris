// Definisi Library yang digunakan
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('req-flash');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


// Definisi lokasi file router
const loginRoutes = require('./src/routes/router-login');
const menu_utamaRoutes= require('./src/routes/menu_utama');
const pasienRoutes = require ('./src/routes/pasienRoutes');
const antrianRoutes=require ('./src/routes/antrian');
// Configurasi dan gunakan library
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
// Configurasi library session
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 't@1k0ch3ng',
    name: 'secretName',
    cookie: {
        sameSite: true,
        maxAge: 60000
    },
}))
app.use(flash());

// Setting folder views
app.set('views',path.join(__dirname,'src/views'));
app.set('view engine', 'ejs');
//public
app.use(express.static(path.join(__dirname, 'src/public')));
// Gunakan routes yang telah didefinisikan
app.use('/login', loginRoutes);
app.use('/menu', menu_utamaRoutes);
app.use('/pasien', pasienRoutes);
app.use('/antrian', antrianRoutes);

// Socket io event
// Socket.IO event handling
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('callPatient', (data) => {
        io.emit('patientCalled', data);
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Gunakan port server
server.listen(5050, ()=>{
    console.log('Server Berjalan di Port : '+5050);
});

// session


// tambahkan ini
app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.setHeader('Pragma', 'no-cache');
    next();
});



