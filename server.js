var CONFIG            = require('./config.js');
var exec              = require('child_process').exec;
var path              = require('path');
var express           = require('express')();

var server            = require('http').Server(express);
var io                = require('socket.io')(server);
var serveStatic       = require('serve-static');
var fs                = require("fs");
var bodyParser        = require('body-parser');
var five              = require("johnny-five");
var osascript         = require('node-osascript');

var button;
var ringtone;
var ringCues = [];
var timeoutTakePictures = [];
var phonePickedUp = false;

for (var i = 0; i <= 8; i++) {
  ringCues[i] = '';
}

for (var i = 0; i < CONFIG.phone.delayBeforePictures.length; i++) {
  timeoutTakePictures[i] = '';
}

/////////////////////////

express.use( serveStatic( __dirname + '/app/' ) );
express.use( bodyParser.urlencoded({
  extended: true
}));
express.set( 'view engine', 'ejs' );

express.get('/:view', function (req, res) {   
   
  var view = req.params.view;
  
  res.render( __dirname + '/app/views/'+view, {
    BASEURL : CONFIG.site.baseURL
  });
});

/////////////////////////

io.on('connection', function(socket){
  console.log('Socket ready!');
  var board = new five.Board();
  
  board.on("ready", function() {
    var led = new five.Led(13);
    led.blink(500);
    
    ringtone = new five.Pin(8);
    
    console.log('Board & socket ready!');
    
    enableRingtone();
    
    button = new five.Button({
      pin: 7,
      isPullup: true,
      invert: true
    });
    
    button.on("up", function() {
      console.log("Phone back on the base");
      hangUpThePhone();
      
      io.sockets.emit('audio/stop');
    });
    
    button.on("down", function() {
      console.log("Phone in the air!");
      pickUpThePhone();
      
      io.sockets.emit('audio/play');
    });
  });

  socket.on('disconnect', function(){});
});


server.listen(CONFIG.site.port, function(){
  console.log('Listening on *:'+CONFIG.site.port);
});


/////////////////////////

function enableRingtone() {
  console.log('Enable Ringtone');
  
//  letsRing();

  setInterval(function(){ 
    if (phonePickedUp == false) {
      letsRing(); 
    }
  }, CONFIG.phone.delayBetweenCalls*1000);
}

function letsRing() {
  var ringSequence = '';
  
  console.log('Let\'s ring!');
  
  ringCues[0] = setTimeout(function(){ ringHigh(); },   0);
  ringCues[1] = setTimeout(function(){ ringLow(); },    1500);
  
  ringCues[2] = setTimeout(function(){ ringHigh(); },   3500);
  ringCues[3] = setTimeout(function(){ ringLow(); },    5000);
  
  ringCues[4] = setTimeout(function(){ ringHigh(); },   7000);
  ringCues[5] = setTimeout(function(){ ringLow(); },    8500);
  
  ringCues[6] = setTimeout(function(){ ringHigh(); },   10500);
  ringCues[7] = setTimeout(function(){ ringLow(); },    12000);
}

function pickUpThePhone() {
  phonePickedUp = true;
  
  for (var i = 0; i < ringCues.length; i++) {
    clearTimeout(ringCues[i]);
  }
  
  for (var i = 0; i < timeoutTakePictures.length; i++) {
    timeoutTakePictures[i] = setTimeout(function(){
      takePicture();
    }, CONFIG.phone.delayBeforePictures[i]*1000);
  }
  
  ringLow();
}

function hangUpThePhone() {
  phonePickedUp = false;
  
  for (var i = 0; i < timeoutTakePictures.length; i++) {
    clearTimeout(timeoutTakePictures[i]);
  }
}

function ringHigh() {
  ringtone.high();
}

function ringLow() {
  ringtone.low();
}
 
function takePicture() { 
  
  osascript.execute('tell application "RemoteCameraControl" to activate',function(err, result, raw){
    if (err) return console.error(err);
    console.log('RemoteCameraControl : activated.');
    
    setTimeout(function(){
      exec("./scripts/cliclick/cliclick c:224,189");
    },300);
  });
}