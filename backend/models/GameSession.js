const mongoose = require('mongoose')

const gameSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mode: {
    type: String,
    enum: ['memory', 'sequence', 'math', 'speed'],
    required: true,
  },
  score: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  wrongAnswers: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }, // in seconds
  xpEarned: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('GameSession', gameSessionSchema)