const Subscriber = require('../models/Subscriber');

exports.addSubscriber = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ message: 'Thank you for subscribing!' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
  }
}; 