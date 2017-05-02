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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set static files as CSS and JS
app.use(express.static('public'));

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

// socket.io countdown
var countdown;

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

// route home page
app.get('/', function(req, res) {
    // reset socket.io countdown
    clearInterval(countdown);

    var boxColor = htmlColor.random();  // send to box
    var textColor = htmlColor.random(); // Text color the user sees
    var otherColor = htmlColor.random(); // Send to other box

    var goodAnswer = colorToHexCheck(boxColor);
    var wrongAnswer = colorToHexCheck(textColor);
    var randomColor = colorToHexCheck(otherColor);

    console.log('goodAnswer:  ' + goodAnswer);
    console.log('wrongAnswer:  ' + wrongAnswer);
    console.log('randomColor:  ' + randomColor);

    function colorToHexCheck(color) {
        if (!toHex(color)) {
            var newColor = htmlColor.random();
            console.log('der ging iets fout', color, toHex(newColor));
            return newColor;
        } else {
            return htmlColor.random();
        }
    };

    if(Math.round(Math.random())) {
        sendColorToButton(users[0].button1, toHex(randomColor));
        sendColorToButton(users[0].button2, toHex(goodAnswer));
    } else {
        sendColorToButton(users[0].button1, toHex(goodAnswer));
        sendColorToButton(users[0].button2, toHex(randomColor));
    }

    res.render('index', {
        colors: goodAnswer,
        textcolor: wrongAnswer
    });
});

// Dont know where to put this thing yet..
io.on('connection', function(socket){
    var counter = 5;
    countdown = setInterval(function(){
        counter--;
        io.sockets.emit('counter', counter);
        if (counter === 0) {
            io.sockets.emit('counter', "time's up!");
            clearInterval(countdown);
        }
    }, 1000);
});

function sendColorToButton(buttonId, color) {
    request({
        uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
        qs: {
            t: 'sdc',
            d: buttonId,
            td: buttonId,
            c: color
        }
    });
}

app.get('/begin', function(req, res) {
    request({
        uri: `http://oege.ie.hva.nl/~palr001/icu/api.php`,
        qs: {
            t: 'rdc',
            d: '8548',
            td: '8548'
        }
    });
});

app.get('/sendAnswer', function(req, res) {
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