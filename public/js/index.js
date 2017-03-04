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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    
    $('#messages').append(html);
    scrollToBottom();
    
    // var li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    
    // $('#messages').append(li);
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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    
    $('#messages').append(html);
    scrollToBottom();
    
    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My current location</a>');
    
    // li.text(`${message.from}: ${formattedTime} `);
    // a.attr('href', message.url);
    // li.append(a);
    
    // $('#messages').append(li);
});

//if connection is disconnected do something
socket.on('discconect', function(){
    console.log('discconected from server');
});


//print form onto screen with jquery
$('#message-form').on('submit', function(e) {
    e.preventDefault();
    
    var messageTextbox = $('[name=message]')
    
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function() {
        //clear message form
        messageTextbox.val('');
    });
});

//geolocation
var locationButton = $('#send-location');

locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported');
    }
    
    //disable send location button while it is working.
    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    
    navigator.geolocation.getCurrentPosition(function(position){
        //after location msg is sent enable it again
        locationButton.removeAttr('disabled').text('Send Location');
        
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send Location');
        alert('unable to fetch location');
    });
});

//auto-scrolling
function scrollToBottom(){
    //selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};