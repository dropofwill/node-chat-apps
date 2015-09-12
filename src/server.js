var constants = require('./constants'),
    udp = require('./udp'),
    broadcast_address = require('./broadcast-address'),
    utils = require('./utils');

// var BROADCAST_ADDRESS = constants.BROADCAST_ADDRESS,
var BROADCAST_ADDRESS = broadcast_address(),
    CLIENT_PORT = constants.CLIENT_PORT,
    SERVER_PORT = constants.SERVER_PORT;

// Creat connection -> create_socket() -> socket
//
// Handle message -> on_data(socket, callback) -> null
//
// Start listening -> start_server() -> null

var socket = udp.create_socket(),
    send_data = udp.send_data_factory(socket, SERVER_PORT, BROADCAST_ADDRESS);

// function sendMessage(data) {
//   socket.send(data, 0, data.length, SERVER_PORT, BROADCAST_ADDRESS, function(err) {
//     if(err) {
//       throw err;
//     }
//   });
// }

socket.on('message', function(data, rinfo){
  //Check if the client's port was equal to the port we are expecting client data on
  //If so, we will just assume the packets are for us. Normally you should validate somehow.
  if (rinfo.port === CLIENT_PORT) {
    console.log('\nreceived');

    //call function to broadcast the data out to everyone on the local network
    // sendMessage(data);
    send_data(data);
  }
});

socket.bind(CLIENT_PORT, '', function(){
  socket.setBroadcast(true);
  console.log('listening on port ' + SERVER_PORT + "\n");
});

utils.setup_graceful_shutdown(sendMessage);
