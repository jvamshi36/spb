const MiscClaim = require('../models/MiscellaneousClaim');

exports.create = async (req, res) => {
  try {
    const { date, name, price } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Attachment required' });
    const claim = new MiscClaim({
      userId: req.user._id,
      date,
      name,
      price,
      attachment: req.file.path,
      status: 'pending'
    });
    await claim.save();
    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit claim' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const claims = await MiscClaim.find().populate('userId', 'name email');
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch claims' });
  }
};

exports.approve = async (req, res) => {
  try {
    const claim = await MiscClaim.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve claim' });
  }
};

exports.reject = async (req, res) => {
  try {
    const claim = await MiscClaim.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject claim' });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const claims = await MiscClaim.find({ userId }).sort({ date: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user miscellaneous claims' });
  }
}; 