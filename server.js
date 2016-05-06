// require stuff
var express = require('express');
var bodyParser = require('body-parser');
var path = require("path");

// create app
var app = express()

// config our app
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
// app.use(express.static(__dirname + './node_moudles'))

// our routes
app.get('/', function(req, res){
	res.render('index')
})

var server = app.listen(8000, function(){
	console.log('================')
	console.log('======8000======')
	console.log('================')
});

var io = require('socket.io').listen(server)
var messageHistory = []
// console.log(io)
// when a socket connects
io.sockets.on('connection', function(socket){
	console.log('client connected!')
	// when a socket emits the keyword userName we do something
	socket.on('userName', function(data){
		console.log(data)
		var name = data.name
		// we emit back our message history and the name of the new user
		socket.emit('userNamereceived', {messageHistory: messageHistory, name: name})
	})
	// we listen for the chatting emit, when heard we do stuff
	socket.on('chatting', function(data){
		console.log(data, messageHistory)
		// add new message with user attached to our message history
		messageHistory.push(data)
		// send back new message to the client to append to the chat box
		io.emit('chatReceived', data)
	})
})

