const express = require('express');
const router = express.Router();
const { getMentors } = require('../controllers/mentorsController');

router.get('/', getMentors);

module.exports = router; 