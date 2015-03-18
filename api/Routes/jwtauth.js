var User = require('../Models/User');
var jwt = require('jwt-simple');

 
module.exports = function(req, res, next) {
	var token = (req.params.token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
	if (token) {
	  try {
	    var decoded = jwt.decode(token, 'ParkingLot123');
	    if (decoded.exp <= Date.now()) {
  			res.end('Access token has expired', 400);
		}
		User.findOne({ email: decoded.iss }, function(err, user) {
		  req.user = user;
		  next();
		});
	 
	  } catch (err) {
	    return next();
	  }
	} else {
	  next();
	}

};