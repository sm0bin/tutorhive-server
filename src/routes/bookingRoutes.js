const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, bookingController.getAllBookings);
// router.get('/:id', verifyToken, bookingController.getBooking);
router.post('/', bookingController.createBooking);
// router.delete('/:id', verifyToken, bookingController.deleteBooking);
router.put('/:id', verifyToken, bookingController.updateBooking);

module.exports = router;