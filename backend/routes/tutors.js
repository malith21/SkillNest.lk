const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/tutors?module=xxx - get tutors for a module
router.get('/', protect, async (req, res) => {
  try {
    const { module } = req.query;
    const query = { role: 'tutor', isAvailable: true };
    if (module) query.tutorModules = { $in: [module] };
    const tutors = await User.find(query).select('-password');
    res.json(tutors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
