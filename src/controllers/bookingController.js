const Booking = require('../models/Booking');
const verifyToken = require('../middlewares/verifyToken');

// Bookings Routes
exports.getAllBookings = async (req, res) => {
    try {
        if (req.query.email !== req.user.email) {
            return res.status(401).send({ message: "Access Denied" });
        }

        if (req.query?.email) {
            const query1 = { "serviceProvider.email": req.query.email };
            const userPending = await Booking.find(query1).lean().exec();
            const query2 = { "serviceUser.email": req.query.email };
            const userBooking = await Booking.find(query2).lean().exec();
            res.send({ userPending, userBooking });
        } else {
            const result = await Booking.find().lean().exec();
            res.send(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const newBooking = req.body;
        const result = await Booking.create(newBooking);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.updateBooking = verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const updateState = req.body.serviceState;
        const result = await Booking.findByIdAndUpdate(id, { "serviceDetails.state": updateState }, { new: true }).lean().exec();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
