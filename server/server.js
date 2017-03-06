//third party libs
const express = require("express");
const socketIO = require("socket.io");

//node core modules
//path joins all given path segments together
const path = require("path");
const http = require("http");

//local files
const {generateMessage, generateLocationMessage} = require("./utils/message.js");
const {isRealString} = require("./utils/validation.js");
const {Users} = require("./utils/users.js");

const port = process.env.PORT || 3000;
//creating new users (from users.js)
var users = new Users();

//create easy path to public
const publicPath = path.join(__dirname, '../public');

//start express
var app = express();
//serve the public folder on requests
app.use(express.static(publicPath));

//http required to integrate socketio
//same as app.listen but used with socketio
var server = http.createServer((app));
//creates socket on server
var io = socketIO(server);



//does something when connection is established.
//only use io.on for connecting, then add functions IN it not ON it
//.on is basically a listener for events (if in server then from client)
                     //socket is coming from index.js(client);
io.on('connection', (socket) => {
    console.log('new user connected');
    
    
    //emit used to create events to a single connection
    //second argument is used to add content to event (usually used with objects.)
        // socket.emit('newMessage', {
        //     from: 'bill',
        //     text: 'Hello world',
        //     createdAt: 123
        // });
    
    //socket.broadcast emits to everyone except sender
        // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    socket.on('join', (params, callback) => {
        //prevent empty username and empty room name
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }
        //prevent name duplication
        if (users.getUserList(params.room).indexOf(params.name) !== -1) {
            return callback('Name is being used');
        }
        //join connects sockets with same name(adds people to chat room w/ same name)
        socket.join(params.room);
        
        //removes user from all other rooms
        users.removeUser(socket.io);
        //adds user to a room
        users.addUser(socket.id, params.name, params.room);
        
        //leaves connected socket with argument name
        //socket.leave(params.room)
        
        // .to sends something to every connected socket of argument
            // io.to.(params.name).emit
            // broadcast.to(params.name).emit sends something to every connected socketd of argument expect sender
                //socket.broadcast.to(params.name).emit
        
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        
        //emit used to create events to a single connection
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));    
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        
        //callback from client side 'emit' function
        callback();
    });
    
    //listen for createMessage from client
                                //message is the content in createEmail
    socket.on('createMessage', (message, callback) => {
        //log the message on server
        console.log('msg received: ', message);
        
        var user = users.getUser(socket.id);
        
        //if user exists and is sending a real string:
        if (user && isRealString(message.text)) {
            //io.emit emits to every connected client
            //send message to everyone in room
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        //runs callback function from client
                  //message to send to client 
        callback();
        
        //socket.broadcast emits to everyone except sender 
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });
    
    //geolocation
    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        
        //if user exists and is sending a real string:
        if (user) {
            //io.emit emits to every connected client
            //send message to everyone in room
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });
    
    //when client disconnects do something
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin', `${user.name} has left`));
        }
    });
});


//express server
server.listen(port, process.env.IP, () => {
    console.log(`Server is running on ${port}`);
})