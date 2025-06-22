const express = require('express');
const router = express.Router();
const { addSubscriber } = require('../controllers/subscribeController');

router.post('/', addSubscriber);

module.exports = router; 