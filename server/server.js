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
                     //socket is coming from index.html(client);
io.on('connection', (socket) => {
    console.log('new user connected');
    
    //when client disconnects do something
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});



//express server
server.listen(port, process.env.IP, () => {
    console.log(`Server is running on ${port}`);
})