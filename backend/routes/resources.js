const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/resources';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/resources - list with filter
router.get('/', protect, async (req, res) => {
  try {
    const { subject, semester, type, search, status } = req.query;
    const query = {};
    if (req.user.role === 'student') query.status = 'approved';
    else if (status) query.status = status;
    if (subject) query.subject = new RegExp(subject, 'i');
    if (semester) query.semester = semester;
    if (type) query.resourceType = type;
    if (search) query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/resources/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const r = await Resource.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!r) return res.status(404).json({ message: 'Resource not found' });
    res.json(r);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/resources - upload
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const { title, description, subject, semester, resourceType, externalLink, tags } = req.body;
    const resource = await Resource.create({
      title, description, subject, semester,
      resourceType: resourceType || 'pdf',
      fileUrl: req.file ? `/uploads/resources/${req.file.filename}` : undefined,
      externalLink,
      tags: tags ? JSON.parse(tags) : [],
      uploadedBy: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });
    res.status(201).json(resource);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/resources/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });
    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    Object.assign(resource, req.body);
    await resource.save();
    res.json(resource);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/resources/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });
    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    if (resource.fileUrl) {
      const filePath = path.join(__dirname, '..', resource.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await resource.deleteOne();
    res.json({ message: 'Resource deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/resources/:id/bookmark
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    const uid = req.user._id;
    const idx = resource.bookmarks.indexOf(uid);
    if (idx === -1) resource.bookmarks.push(uid);
    else resource.bookmarks.splice(idx, 1);
    await resource.save();
    res.json({ bookmarked: idx === -1, bookmarkCount: resource.bookmarks.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/resources/:id/rate
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    const resource = await Resource.findById(req.params.id);
    const existing = resource.ratings.find(r => r.user.toString() === req.user._id.toString());
    if (existing) existing.rating = rating;
    else resource.ratings.push({ user: req.user._id, rating });
    resource.averageRating = resource.ratings.reduce((a, b) => a + b.rating, 0) / resource.ratings.length;
    await resource.save();
    res.json({ averageRating: resource.averageRating });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/resources/:id/approve (admin)
router.post('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id, { status: req.body.status || 'approved' }, { new: true }
    );
    res.json(resource);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/resources/:id/ai-summary - mock AI summary
router.post('/:id/ai-summary', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });

    // Mock AI summary (in production, call OpenAI/Anthropic API here)
    const mockSummary = `This academic resource titled "${resource.title}" covers key concepts in ${resource.subject}. It provides comprehensive coverage of fundamental principles and practical applications suitable for semester ${resource.semester} students.`;
    const mockKeyPoints = [
      `Core concepts of ${resource.subject} explained clearly`,
      `Practical examples and case studies included`,
      `Suitable for ${resource.semester} level students`,
      `Covers theoretical frameworks and real-world applications`,
      `Includes summary of key definitions and formulas`
    ];

    resource.aiSummary = mockSummary;
    resource.keyPoints = mockKeyPoints;
    resource.aiProcessed = true;
    await resource.save();
    res.json({ aiSummary: mockSummary, keyPoints: mockKeyPoints });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
