var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FloorSchema   = new Schema({
    floor_id: {type: Number, required: true, unique: true},
    capacity: {type: Number, required: true, min: 0},
    disponibility: {type: Number, required: true, min: 0}
});

module.exports = mongoose.model('Floor', FloorSchema);