const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { protect } = require('../middleware/auth');

// POST /api/tickets - create ticket
router.post('/', protect, async (req, res) => {
  try {
    const { tutor, module, subject, description, helpType, priority } = req.body;
    const ticket = await Ticket.create({
      student: req.user._id, tutor, module, subject, description,
      helpType: helpType || 'peer_help', priority: priority || 'medium'
    });
    await ticket.populate(['student', 'tutor']);
    res.status(201).json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/tickets - get my tickets
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'student'
      ? { student: req.user._id }
      : req.user.role === 'tutor'
        ? { tutor: req.user._id }
        : {};
    const tickets = await Ticket.find(query)
      .populate('student', 'name email avatar')
      .populate('tutor', 'name email avatar tutorModules')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/tickets/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('student', 'name email avatar')
      .populate('tutor', 'name email avatar');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/tickets/:id - update status
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, priority } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    await ticket.save();
    res.json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/tickets/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.student.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
