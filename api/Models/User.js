var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema   = new Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']},
    password: {type: String, required: true},
    admin: {type: Boolean, default: false},
    operator: {type: Boolean, default: false},
    state: {type: Boolean, default: true}
});

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);