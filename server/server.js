//third party libs
const express = require("express");
const socketIO = require("socket.io");

//node core modules
//path joins all given path segments together
const path = require("path");
const http = require("http");

const port = process.env.PORT || 3000;

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
//.on is basically a listener for client events
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
    
    //listen for createMessage from client
                                //message is the content in createEmail
    socket.on('createMessage', (message) => {
        console.log('msg received: ', message);
        ///io.emit emits to every connected client
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });
    
    //when client disconnects do something
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});


//express server
server.listen(port, process.env.IP, () => {
    console.log(`Server is running on ${port}`);
})