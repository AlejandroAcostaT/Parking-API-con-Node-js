var express    = require('express'); 
var Parking	   = require('./Parking');

exports.seedParking = function seedParking(){
	Parking.find({}).exec(function(err, collection){
		if (collection.length === 0){
			var Park= new Parking();
			Park.floors_number= 0;
			Park.fare = 10;
			Park.save(function(err){
				if(err)
				return res.send(err);

				console.log('Parking Created');
			});
		}
	});
}