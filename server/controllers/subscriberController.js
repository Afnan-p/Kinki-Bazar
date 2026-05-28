const asyncHandler = require('../utils/asyncHandler');
const Subscriber = require('../models/Subscriber');

// @desc    Add new subscriber
// @route   POST /api/subscribers
// @access  Public
const addSubscriber = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const subscriberExists = await Subscriber.findOne({ email });

  if (subscriberExists) {
    res.status(400);
    throw new Error('This email is already subscribed to our newsletter');
  }

  const subscriber = await Subscriber.create({ email });

  res.status(201).json({
    message: 'Successfully subscribed to the newsletter!',
    subscriber
  });
});

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
  res.json(subscribers);
});

// @desc    Delete a subscriber
// @route   DELETE /api/subscribers/:id
// @access  Private/Admin
const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await Subscriber.findById(req.params.id);

  if (subscriber) {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber removed' });
  } else {
    res.status(404);
    throw new Error('Subscriber not found');
  }
});

module.exports = {
  addSubscriber,
  getSubscribers,
  deleteSubscriber,
};
