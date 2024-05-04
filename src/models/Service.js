const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    serviceImage: String,
    serviceName: String,
    serviceDescription: String,
    serviceProvider: {
        image: String,
        name: String,
        email: String,
    },
    servicePrice: Number,
    serviceArea: String,
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;