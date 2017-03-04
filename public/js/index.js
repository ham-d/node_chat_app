//no ES6 because client browser might not be compatable with es6

// to establish socket connection to server
//io() is coming from /socket.io/socket.io.js 
var socket = io();

//if connection is established do something
socket.on('connect', function(){
    console.log('Connected to server');
    
    //emit creates event to send to server.
    // socket.emit('createMessage', {
    //     from: 'bob',
    //     text: 'hey there'
    // });
});

//when newMessage function from server is successful do something on client side(check dev tools)
                               //message is the second argument from server side newMessage function
socket.on('newMessage', function(message) {
    console.log('New Message', message);
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    
    $('#messages').append(li);
});

// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hi'
//     //this callback runs when server recieves initial function from client
//     //then server sends whatever is in callback to client
//             //data = 'This is from the server' in this case
// }, function(data) {
//     console.log(data);
// });

//listen for geolocation events
socket.on('newLocationMessage', function (message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');
    
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    
    $('#messages').append(li);
});

//if connection is disconnected do something
socket.on('discconect', function(){
    console.log('discconected from server');
});


//print form onto screen with jquery
$('#message-form').on('submit', function(e) {
    e.preventDefault();
    
    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message]').val()
    }, function() {});
});

//geolocation
var locationButton = $('#send-location');

locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported');
    }
    
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        alert('unable to fetch location');
    })
});
