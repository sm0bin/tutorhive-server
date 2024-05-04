const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    serviceId: String,
    serviceName: String,
    serviceImage: String,
    servicePrice: Number,
    serviceDescription: String,
    serviceArea: String,
    serviceProvider: {
        image: String,
        name: String,
        email: String,
    },
    serviceUser: {
        image: String,
        name: String,
        email: String,
    },
    serviceDetails: {
        address: String,
        startingDate: String,
        status: String,
    },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;