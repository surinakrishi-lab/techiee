const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  company: { type: String, default: '-' },
  need: { type: String, required: true },
  budget: { type: String, default: '-' },
  message: { type: String, required: true },
  receivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
