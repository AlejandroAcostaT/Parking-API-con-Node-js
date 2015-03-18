var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReservaSchema   = new Schema({
    user_email: {type: String},
    floor_id: {type: Number, required: true},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    prize: {type: Number, min: 0.0, default: 0.0},
    paid: {type: Boolean, default: false}
});

module.exports = mongoose.model('Reserva', ReservaSchema);