const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getService);
router.post('/', serviceController.createService);
router.delete('/:id', serviceController.deleteService);
router.put('/:id', serviceController.updateService);

module.exports = router;
