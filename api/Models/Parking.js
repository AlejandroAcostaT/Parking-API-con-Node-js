var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ParkingSchema   = new Schema({
    floors_number: {type: Number, required: true, unique: true},
    fare: {type: Number, required: true, min: 0.0}
});

module.exports = mongoose.model('Parking', ParkingSchema);