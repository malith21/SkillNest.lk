const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/avatars';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, req.user._id + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// GET /api/users (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/users/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/users/:id - update profile
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });

    const { name, academicProfile, tutorModules, emailNotifications } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
    if (tutorModules) user.tutorModules = tutorModules;
    if (academicProfile) {
      user.academicProfile = { ...user.academicProfile.toObject(), ...academicProfile };
      // Calculate profile completion
      const ap = user.academicProfile;
      let filled = 0;
      if (ap.degreeProgram) filled++;
      if (ap.currentSemester) filled++;
      if (ap.subjects?.length > 0) filled++;
      if (ap.skills?.length > 0) filled++;
      if (ap.gpa > 0) filled++;
      user.academicProfile.profileCompletion = Math.round((filled / 5) * 100);
    }
    await user.save();
    res.json({ message: 'Profile updated', user: { ...user.toObject(), password: undefined } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/users/avatar - upload avatar
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.avatar = `/uploads/avatars/${req.file.filename}`;
    await user.save();
    res.json({ avatar: user.avatar });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/users/:id (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
