const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  semester: { type: String, required: true },
  resourceType: {
    type: String,
    enum: ['pdf', 'link', 'notes', 'video', 'other'],
    default: 'pdf'
  },
  fileUrl: { type: String },
  externalLink: { type: String },
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 }
  }],
  averageRating: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },

  // AI Summary
  aiSummary: { type: String, default: '' },
  keyPoints: [{ type: String }],
  aiProcessed: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
