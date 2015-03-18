var express    = require('express'); 
var jwt 	   = require('jwt-simple');
var bodyParser = require('body-parser');
var User	   = require('../Models/User');
var Reserve    = require('../Models/Reserva');
var Floor      = require('../Models/Floor');
var Parking	   = require('../Models/Parking');
var moment	   = require('moment');
var router     = express.Router();
var jwtauth    = require('./jwtauth.js');



router.get('/users/index', function(req,res){
	User.find(function(err, users) {
            if (err)
                return res.send(err);

            var Res=[];
            for(var each in users){
            	Res.push({id: users[each].id, name: users[each].name, lastname: users[each].lastname, email: users[each].email, state: users[each].state, admin: users[each].admin, operator: users[each].operator});
            }
            res.json(Res);
        });
});

router.post('/users/signin', function(req,res){
	var user = new User();
	user.name = req.body.name;
	user.lastname = req.body.lastname;
	user.email = req.body.email;
	user.password = req.body.password;

	user.save(function(err){
		if(err)
			return res.send(err);

		res.json({message: 'User created!'});
	});
});

router.post('/users/login', function(req, res){
	var email = req.body.email;
	var pass  = req.body.password;

	User.findOne({email: email}, function(err, user){
		if(err){
			return res.send(err);
		}

		if(!user){
            return res.send('User not found');
        }

        if(user.password != pass){
        	return res.send('invalid password');
        }

        if(!user.state){
        	return res.send('You are not allowed on the system, please contact the admin');
        }

        var expires = moment().add(1,'days').valueOf();

        var token = jwt.encode({
        	iss: user.email,
        	exp: expires
        }, 'ParkingLot123');
        
        //var usr = {id: user.id, name: user.name, lastname: user.lastname, email: user.email, state: user.state, admin: user.admin, operator: user.operator};

        res.json({
        	token: token,
        	expires: expires,
        });
	});
});


router.route('/users/:token')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get([jwtauth], function(req, res) {
    	if(req.user){
    		User.findOne({email: req.user.email}, function(err, user) {
            if (err)
                return res.send(err);

            if(!user)
            	return res.send('User not found');
            if(!user.state){
	        	return res.send('You are not allowed on the system, please contact the admin');
	        }
            
            var reser;
            Reserve.find({user_email: req.user.email}, function(err, reserve){
            	if(err)
            		return res.send(err);

            	if(!reserve)
            		return res.send('Reserves not found');

            	var Res={id: user.id, name: user.name, lastname: user.lastname, email: user.email, state: user.state, admin: user.admin, operator: user.operator, reserves: reserve};
            	res.json(Res);
        	});

            });
            
            
    	}else{
    		return res.send('Invalid token');
    	}
        
    })

    .put([jwtauth],function(req, res) {
    	if(req.user){
    		User.findOne({email: req.user.email}, function(err, user) {

	            if (err)
	                return res.send(err);

	            if(!user)
	            	return res.send('User not found');

	            if(!user.state){
		        	return res.send('You are not allowed on the system, please contact the admin');
		        }

	            if(req.body.name)
	            	user.name = req.body.name;

	        	if(req.body.lastname)
					user.lastname = req.body.lastname;

				if(req.body.password)
					user.password = req.body.password;

	            // save the bear
	            user.save(function(err) {
	                if (err)
	                    return res.send(err);

	                res.json({ message: 'User updated!' });
	            });

        	});
    	}else{
    		return res.send('Invalid token');
    	}        
    })

    .delete([jwtauth], function(req, res) {
    	if(req.user){
	        User.remove(
	            {email: req.user.email}
	        , function(err, user) {
	            if (err)
	                return res.send(err);

	            if(!user)
	            	return res.send('User not found');

	            if(!req.user.state){
		        	return res.send('You are not allowed on the system, please contact the admin');
		        }

	            res.json({ message: 'User successfully deleted' });
	        });
	    }else{
	    	return res.send('Invalid token');
	    }
    });

router.route('/users/:token/discharge')
	.put([jwtauth], function(req, res){
		if (req.user){
			if(!req.user.state){
	        	return res.send('You are not allowed on the system, please contact the admin');
	        }
			var user = req.user;
			user.state = false;
			user.save(function(err){
				if(err)
					return res.send(err);
				return res.send('You have been discharged');
			});
		}else{
			return res.send('Invalid token');
		}
	})

	.post([jwtauth], function(req, res){
		if (req.user){
			if(!req.user.admin)
				return res.send('You must be an admin');

			User.findOne({email: req.body.email}, function(err, user){
				if(err)
					return res.send(err);
				if(!user)
					return res.send('User not found');

				user.state = !(user.state);
				user.save(function(err){
					if(err)
						res.send(err);
					if(user.state){
						return res.send('User is allowed again');
					}else{
						return res.send('User has been discharged');
					}	
				});
			});
		}else{
			return res.send('Invalid token');
		}
	});

router.route('/users/:token/reserves')

	.get([jwtauth], function(req, res) {
    	if(req.user){
    		if(!req.user.state){
	        	return res.send('You are not allowed on the system, please contact the admin');
	        }
    		Reserve.find(function(err, reserves) {
            res.json(reserves);

            });
            
            
    	}else{
    		return res.send('Invalid token');
    	}
        
    })

    .post([jwtauth], function(req,res){
    	if(req.user){
    		if(req.user.admin || req.user.operator)
    			return res.send('Invalid type of user');
    		if(!req.user.state){
	        	return res.send('You are not allowed on the system, please contact the admin');
	        }
    		Reserve.findOne({user_email: req.user.email, paid: false}, function(err, reser){
    			if(err)
    				return res.send(err);

    			if(reser)
    				return res.send('User alredy has an active reserve');

    			var reserve = new Reserve();
				reserve.user_email = req.user.email;
				reserve.floor_id = req.body.floor_id;

				Floor.findOne({floor_id: reserve.floor_id}, function(err, floor){
					if(err)
						return res.send(err);
					if(!floor || floor.disponibility === 0)
						return res.send('invalid floor')

					floor.disponibility = floor.disponibility -1;
					floor.save(function(err){
						if(err)
							return res.send(err);

						reserve.save(function(err){
							if(err)
								return res.send(err);

							res.json({message: 'Reserve created!'});
						});
					});	
				});
    		});
	   	}else{
    		return res.send('Invalid token');
    	}
	});

router.route('/users/:token/reserves/:user_email')
	.post([jwtauth], function(req,res){
    	if(req.user){
    		if(!req.user.operator)
    			return res.send('User must be the operator');
    		Reserve.findOne({user_email: req.params.user_email, paid: false}, function(err, reserve){
    			if (err)
    				return res.send(err);
    			if(!reserve)
    				return res.send('User doesnt have any active reservation');
    			Parking.find(function(err, parkings){
    				if(err)
    					return res.send(err);

    				if(!parkings)
    					return res.send('ERROR');

    				var parking = parkings[0];
    				reserve.paid = true;
    				reserve.updated = Date.now();
    				reserve.prize = parking.fare * ((reserve.updated.getTime()-reserve.created.getTime()) / (1000*60*60));
    				reserve.save(function(err){
    					if(err)
    						return res.send(err);

    					Floor.findOne({floor_id: reserve.floor_id}, function(err, floor){
    						if(err)
    							return res.send(err);

    						floor.disponibility= floor.disponibility + 1;
    						floor.save(function(err){
    							if(err)
    								return res.send(err);
    							return res.send('Reserve is paid');
    						});
    					});
    				});
    			});
    		});
		}else{
			return res.send('Invalid token');
		}
	});


module.exports = router;
