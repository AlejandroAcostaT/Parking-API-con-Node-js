var express    = require('express'); 
var jwt 	   = require('jwt-simple');
var bodyParser = require('body-parser');
var User	   = require('../Models/User');
var Parking	   = require('../Models/Parking');
var Floor	   = require('../Models/Floor');
var moment	   = require('moment');
var router     = express.Router();
var jwtauth    = require('./jwtauth.js');

router.route('/parkings/:token')
	.get([jwtauth], function(req,res){
		if(req.user){
			User.findOne({email: req.user.email}, function(err, user) {
	            if (err)
	                return res.send(err);

	            if(!user)
	            	return res.send('User not found');
	            
	            Parking.find(function(err, parkings) {
		            if (err)
		                return res.send(err);

		            Floor.find(function(err, floors){
		            	var parking=({parking: parkings[0], floors: floors});
		            	res.json(parking);
		            })

		            
		    	});

	       	});            
		}else{
			return res.send('Invalid token');
		}
	})

	.put([jwtauth], function(req,res){
		if(req.user){
			User.findOne({email: req.user.email}, function(err, user) {
	            if (err)
	                return res.send(err);

	            if(!user)
	            	return res.send('User not found');

	            if(!user.admin)
	            	return res.send('User must be an admin');
	      
	            Parking.find(function(err, parkings) {
		            if (err)
		                return res.send(err);

		            var park = parkings[0];
		            park.fare = req.body.fare;
		            park.save(function(err) {
		                if (err)
		                    res.send(err);

		                res.json({ message: 'Parking updated!' });
		            });
		    	});
	       	});            
		}else{
			return res.send('Invalid token');
		}
	});

router.route('/parkings/:token/floors')

	.post([jwtauth], function(req,res){
		if(req.user){
			User.findOne({email: req.user.email}, function(err, user) {
	            if (err)
	                return res.send(err);

	            if(!user)
	            	return res.send('User not found');

	            if(!user.admin)
	            	return res.send('User must be an admin');
	            
	            var floor = new Floor();
	            floor.floor_id = req.body.floor_id;
	            floor.capacity = req.body.capacity;
	            floor.disponibility = req.body.capacity;

	            floor.save(function(err){
					if(err)
						return res.send(err);

					Parking.find(function(err, parkings) {
			            if (err)
			                return res.send(err);

			            var parking = parkings[0];
			            parking.floors_number = parking.floors_number +1;
			            parking.save(function(err){
			            	if (err)
			            		return res.send(err);

			            	res.json({message: 'Floor created!'});
			            })
			    	});
				});


	       	});            
		}else{
			return res.send('Invalid token');
		}
	});

router.route('/parkings/:token/floors/:floor_id')
	.get([jwtauth], function(req,res){
		if(req.user){
			User.findOne({email: req.user.email}, function(err, user) {
	            if (err)
	                return res.send(err);

	            if(!user)
	            	return res.send('User not found');

	            if(!user.admin)
	            	return res.send('User must be an admin');
	            
	            Parking.find(function(err, parkings) {
		            if (err)
		                return res.send(err);

		            Floor.findOne({floor_id: req.params.floor_id}, function(err, floor){
		            	if (err)
		                	return res.send(err);
		                res.json(floor);

		            });
		    	});

	       	});            
		}else{
			return res.send('Invalid token');
		}
	})

	.put([jwtauth], function(req,res){
		if(req.user){
			User.findOne({email: req.user.email}, function(err, user) {
	            if (err)
	                return res.send(err);

	            if(!user)
	            	return res.send('User not found');

	            if(!user.admin)
	            	return res.send('User must be an admin');
	            
	           	Floor.findOne({floor_id: req.params.floor_id},function(err, floor) {

		            if (err)
		                return res.send(err);

		            if(!floor)
		            	return res.send('User not found');
		            var cap = floor.capacity;
		            floor.capacity = req.body.capacity;

		            floor.disponibility = req.body.capacity - (cap - floor.disponibility);

		            // save the bear
		            floor.save(function(err) {
		                if (err)
		                    res.send(err);

		                res.json({ message: 'Floor updated!' });
		            });
	       		});   
	       	});         
		}else{
			return res.send('Invalid token');
		}
	})

	.delete([jwtauth], function(req, res) {
    	if(req.user){
    		User.findOne({email: req.user.email}, function(err, user) {
	            if (err)
	                return res.send(err);

	            if(!user)
	            	return res.send('User not found');

	            if(!user.admin)
	            	return res.send('User must be an admin');
	            
	           	Floor.remove({floor_id: req.params.floor_id}, function(err, floor) {
		            if (err)
		                return res.send(err);

		            if(!floor)
		            	return res.send('Floor not found');
		            Parking.find(function(err, parkings) {
			            if (err)
			                return res.send(err);

			            var parking = parkings[0];
			            parking.floors_number = parking.floors_number -1;
			            parking.save(function(err){
			            	if (err)
			            		return res.send(err);

							res.json({ message: 'Floor successfully deleted' });			            
						});
			    	});
	        	});
	       	});     
	    }else{
	    	return res.send('Invalid token');
	    }
    });



module.exports = router;