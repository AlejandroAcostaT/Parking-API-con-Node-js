var express    = require('express');        // call express
var jwt 	   = require('jwt-simple'); 
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var users	   = require('./Routes/users');
var parkings   = require('./Routes/parking');
var seedP	   = require('./Models/parkingSeed');
var seedU	   = require('./Models/userSeed');
var app        = express();    // define our app using express

mongoose.connect('mongodb://localhost/api2'); // connect to our database

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

seedP.seedParking();
seedU.seedUser();
app.use('/api', users);
app.use('/api', parkings);

app.listen(port);
console.log('Magic happens on port ' + port);

