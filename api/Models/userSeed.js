var express    = require('express'); 
var User	   = require('./User');

exports.seedUser = function seedUser(){
	User.find({}).exec(function(err, collection){
		if (collection.length === 0){
			var Admin= new User();
			var Operator= new User();

			Admin.name = 'Admin';
			Admin.lastname = 'Admin';
			Admin.email = 'admin@mail.com';
			Admin.password = '123456';
			Admin.admin = true;

			Admin.save(function(err){
				if(err)
				return res.send(err);

				console.log('Admin Created');
			});

			Operator.name = 'Operator';
			Operator.lastname = 'Operator';
			Operator.email = 'operator@mail.com';
			Operator.password = '123456';
			Operator.operator = true;

			Operator.save(function(err){
				if(err)
				return res.send(err);

				console.log('Operator Created');
			});

		}
	});
}