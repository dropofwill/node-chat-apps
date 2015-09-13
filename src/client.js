//import the user datagram module (udp) - dgram. This has all of the udp methods
var dgram = require('dgram');

var constants = require('./constants'),
    broadcast_address = require('./broadcast-address'),
    udp = require('./udp'),
    utils = require('./utils');

var BROADCAST_ADDRESS = broadcast_address(),
    CLIENT_PORT = constants.CLIENT_PORT,
    SERVER_PORT = constants.SERVER_PORT;

var stdin = process.stdin;
var stdout = process.stdout;

var client_socket = dgram.createSocket({reuseAddr: true, type: 'udp4'});
var server_socket = dgram.createSocket({reuseAddr: true, type: 'udp4'});

function sendMessage(data) {
	client_socket.send(data, 0, data.length, CLIENT_PORT, BROADCAST_ADDRESS, function(err) {
		if(err) {
			throw err;
		}
	});
}

server_socket.on('message', function(data, rinfo){
  //write out the data received converting the data buffer to a string
	console.log('received ' + data.toString());
});

server_socket.bind(SERVER_PORT, '', function() {});

client_socket.bind(CLIENT_PORT, '', function(){

  client_socket.setBroadcast(true);

  console.log('please enter a username...\n');

  stdin.resume();

  var inputCounter = 0; //counter to know if we started taking in input
  var username = "";

  stdin.on('data', function(data){
    //check if input counter is still zero, if so we'll take in a username
    //THIS IS POOR PRACTICE, but will work for the assignment
    //In reality, you'd want something more robust if you were taking in command line input
    if(inputCounter === 0 ) {
        inputCounter++; //increase input counter so it takes messages from now on instead of a username
        username = data; //set username to data from command line
        console.log("username was " + username.toString()); //checking what the input was
        console.log('please enter a message...\n'); //prompt the user to enter a message
        return; //cancel out of function so it does not try to send anything
    }
    console.log('please enter a message...\n');
    //call to send a message to the server passing in whatever was typed on the command line
    sendMessage(data);
  });
});
