const MentorRequest = require('../models/MentorRequest');
const User = require('../models/User');

// Student requests a mentor
exports.createRequest = async (req, res) => {
  try {
    const { mentorId } = req.body;
    if (!mentorId) return res.status(400).json({ message: 'Mentor ID required.' });
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') return res.status(400).json({ message: 'Invalid mentor.' });
    // Prevent duplicate requests
    const existing = await MentorRequest.findOne({ student: req.user.userId, mentor: mentorId, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'Request already pending.' });
    const request = new MentorRequest({ student: req.user.userId, mentor: mentorId });
    await request.save();
    res.status(201).json({ message: 'Mentor request sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all requests for the logged-in user (as student or mentor)
exports.getRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requests = await MentorRequest.find({
      $or: [
        { student: userId },
        { mentor: userId }
      ]
    })
      .populate('student', 'name email avatar bio skills languages role')
      .populate('mentor', 'name email avatar bio skills languages role');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Mentor accepts or rejects a request
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const request = await MentorRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.mentor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    request.status = status;
    request.notified = false;
    await request.save();
    res.json({ message: `Request ${status}.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Mark a request as notified (student has seen the status)
exports.markNotified = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await MentorRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.student.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    request.notified = true;
    await request.save();
    res.json({ message: 'Notification marked as seen.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 