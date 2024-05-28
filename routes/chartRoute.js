const express = require('express');

const chartController = require('./../controllers/chartController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').post(chartController.updateChart);

router.route('/:date').get(chartController.getChart);

module.exports = router;
