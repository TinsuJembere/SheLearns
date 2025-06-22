const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createRequest, getRequests, updateRequest, markNotified } = require('../controllers/mentorRequestsController');

router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.put('/:id', protect, updateRequest);
router.patch('/:id/notify', protect, markNotified);

module.exports = router; 