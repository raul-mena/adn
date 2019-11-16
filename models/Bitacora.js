const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bitacoraSchema = new Schema({
    adn: String,
    mutation: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bitacora', bitacoraSchema);