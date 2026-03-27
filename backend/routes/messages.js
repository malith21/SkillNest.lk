const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// GET /api/messages/:ticketId
router.get('/:ticketId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ ticket: req.params.ticketId })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/messages
router.post('/', protect, async (req, res) => {
  try {
    const { ticketId, content } = req.body;
    const message = await Message.create({
      ticket: ticketId, sender: req.user._id, content
    });
    await message.populate('sender', 'name avatar role');
    res.status(201).json(message);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/messages/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    if (msg.sender.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await msg.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
