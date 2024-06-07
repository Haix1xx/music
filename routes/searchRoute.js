const express = require('express');

const searchController = require('./../controllers/searchController');

const router = express.Router();

router.route('/').get(searchController.search);

router.route('/paging').get(searchController.searchPaging);

router.route('/new-releases').get(searchController.getNewReleases);

module.exports = router;
