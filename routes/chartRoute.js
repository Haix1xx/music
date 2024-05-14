const express = require('express');

const chartController = require('./../controllers/chartController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').post(chartController.updateChart);

module.exports = router;
