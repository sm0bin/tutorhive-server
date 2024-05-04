const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/jwt', authController.generateToken);
router.post('/logout', authController.logoutUser);

module.exports = router;
