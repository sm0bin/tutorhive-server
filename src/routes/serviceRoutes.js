const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', serviceController.getAllServices);
router.get('/:id', verifyToken, serviceController.getService);
router.post('/', verifyToken, serviceController.createService);
router.delete('/:id', verifyToken, serviceController.deleteService);
router.put('/:id', verifyToken, serviceController.updateService);

module.exports = router;
