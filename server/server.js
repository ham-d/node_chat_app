

//path is a core node module
//joins all given path segments together
const path = require("path");

//third party libs
const express = require("express");
const port = process.env.PORT || 3000;

//create easy path to public
const publicPath = path.join(__dirname, '../public');

//start express
var app = express();

app.use(express.static(publicPath));

//express server
app.listen(port, process.env.IP, () => {
    console.log(`Server is running on ${port}`);
})