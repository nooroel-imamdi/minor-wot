var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var toHex = require('colornames');
var htmlColor = require('html-colors');


// socket.io things
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);


var users = [
    {
        name: 'NooroelDylan',
        button1: '04b7', // Button id Dylan
        button2: 'FFA3' // Button id Nooroel
    },
    {
        name: 'OliverRob',
        button1: '0197', // Button id Oliver
        button2: '8548' // Button id Rob
    }
];

var host = users[3];
var target = users[3];

var highscores = [
    {
        name: '0197',
        highscore: 29
    },
    {
        name: '04b7',
        highscore: 23    
    },
    {
        name: 'FFA3',
        highscore: 49
    }
];

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set static files as CSS and JS
app.use(express.static('public'));

// route home page
app.get('/', function(req, res) {
    var goodAnswer = htmlColor.random();  // send to box
    var wrongAnswer = htmlColor.random(); // Text color the user sees
    var randomcolor = htmlColor.random(); // Send to other box

    if (toHex(goodAnswer) === undefined) {
        console.log('undefined kleur, dus: '  + htmlColor.random());
        goodAnswer = htmlColor.random();
    }

    console.log(goodAnswer, toHex(goodAnswer));
    res.render('index', {
        colors: goodAnswer,
        textcolor: wrongAnswer
    });

    // request({
    //     uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
    //     qs: {
    //         t: 'rdc',
    //         t: 'sdc',
    //         d: users[3],
    //         td: users[3],
    //         c: '#000099'
    //     }
    // });

    // Dont know where to put this thing yet..
    io.on('connection', function(socket){
        var counter = 4;
        var WinnerCountdown = setInterval(function(){
            io.sockets.emit('counter', counter);
            counter--;
            if (counter === -1) {
                io.sockets.emit('counter', "time's up!");
                clearInterval(WinnerCountdown);
            }
        }, 1000);
    });
});

app.get('/begin', function(req, res) {
    request({
        uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
        qs: {
            t: 'sqi',
            d: users[3]
        }
    });
});

app.get('/color', function(req, res) {
    console.log(req.query.id)
});

app.get('/highscore', function(req, res) {
    res.render('highscore', {
        highscore: highscores
    })
});

http.listen(process.env.PORT || 5000, function (){
    console.log('server is running: on 5000');
});