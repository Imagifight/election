const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');

const voters = require('./controllers/voters');
const config = require('./config/config');

mongoose.connect(config.database, {
    useNewUrlParser: true
});

//Initialize our app variable
const app = module.exports = express();
//var http = require('http').createServer(app);
//var io = require('socket.io')(http);

app.use('/voter', voters);

const port = config.port;
const host = config.host;

//Middleware for CORS
app.use(cors({
    credentials: true,
    origin: true
}));

//Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files
*/
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    var publicdir = __dirname + 'public';
    if (req.path.indexOf('.') === -1) {
        if (req.path.indexOf('?') === -1) {
            var file = publicdir + req.path + '.html';
            fs.exists(file, function (exists) {
                if (exists)
                    req.url += '.html';
                next();
            });
        } else {
            var file = publicdir + req.path.substring(0, req.path.indexOf('?')) + '.html'
            fs.exists(file, function (exists) {
                if (exists)
                    req.url = req.url.substring(0, req.path.indexOf('?')) + '.html' + req.path.substring(req.path.indexOf('?'));
                console.log(req.url);
                next();
            });
        }
    } else
        next();
});

app.get('/', (req, res) => {
    res.send("<code>Routes:</code><code>\\user</code>");
});

// Add headers
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.header('Access-Control-Allow-Credentials', true);
    next();
});



//Listen to port 8080
var server = module.exports.serever = app.listen(port, host, () => {
    console.log(`Starting the server at ${host}:${port}`);
});
var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
    console.log('socket.io: connected');
    io.emit("hello client");
    socket.on('disconnect', function () {
        console.log('socket.io: disconnected');
    });
    socket.on('unlock', function (socket) {
        console.log('socket.io: unlock');
    });
    socket.on('message', function (data) {
        console.log(data);
    });
});