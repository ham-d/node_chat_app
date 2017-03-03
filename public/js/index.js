// to establish socket connection to server
var socket = io();

//if connection is established do something
socket.on('connect', function(){
    console.log('Connected to server');
    
    //emit creates event to send to server.
    socket.emit('createMessage', {
        from: 'bob',
        text: 'hey there'
    });
});

//when newMessage function from server is successful do something on client side(check dev tools)
                               //message is the second argument from server side newMessage function
socket.on('newMessage', function(message) {
    console.log('New Message', message);
})

//if connection is disconnected do something
socket.on('discconect', function(){
    console.log('discconected from server');
});