const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const GameSession = require('../models/GameSession')
const User = require('../models/User')

const ACHIEVEMENTS = [
  { id: 'first_game',    name: 'Premier pas',      icon: '🎯', condition: (s) => s.totalGames === 1 },
  { id: 'score_100',     name: 'Centurion',         icon: '💯', condition: (s) => s.bestScore >= 100 },
  { id: 'score_500',     name: 'Expert',            icon: '🏆', condition: (s) => s.bestScore >= 500 },
  { id: 'score_1000',    name: 'Maître',            icon: '👑', condition: (s) => s.bestScore >= 1000 },
  { id: 'streak_5',      name: 'En feu',            icon: '🔥', condition: (s) => s.bestStreak >= 5 },
  { id: 'streak_10',     name: 'Inarrêtable',       icon: '⚡', condition: (s) => s.bestStreak >= 10 },
  { id: 'games_10',      name: 'Accro',             icon: '🎮', condition: (s) => s.totalGames >= 10 },
  { id: 'games_50',      name: 'Vétéran',           icon: '🌟', condition: (s) => s.totalGames >= 50 },
]

// POST /api/game/session — Save a completed game session
router.post('/session', auth, async (req, res) => {
  try {
    const { mode, score, level, streak, correctAnswers, wrongAnswers, timeSpent } = req.body

    // Calculate XP
    const xpEarned = Math.floor(score * 0.5 + correctAnswers * 5 + streak * 10)

    // Save session
    const session = await GameSession.create({
      user: req.user._id,
      mode, score, level, streak,
      correctAnswers, wrongAnswers, timeSpent, xpEarned,
    })

    // Update user stats
    const user = await User.findById(req.user._id)
    user.stats.totalGames += 1
    user.stats.totalScore += score
    user.stats.xp += xpEarned
    user.stats.level = Math.floor(user.stats.xp / 200) + 1

    if (score > user.stats.bestScore) user.stats.bestScore = score
    if (streak > user.stats.bestStreak) user.stats.bestStreak = streak
    user.stats.lastPlayedAt = new Date()

    // Update streak (daily)
    const lastPlayed = user.stats.lastPlayedAt
    const today = new Date()
    const diffDays = lastPlayed
      ? Math.floor((today - lastPlayed) / (1000 * 60 * 60 * 24))
      : 999

    if (diffDays === 1) user.stats.currentStreak += 1
    else if (diffDays > 1) user.stats.currentStreak = 1

    // Check achievements
    const newAchievements = []
    const existingIds = user.achievements.map(a => a.id)

    for (const ach of ACHIEVEMENTS) {
      if (!existingIds.includes(ach.id) && ach.condition(user.stats)) {
        user.achievements.push({ id: ach.id, name: ach.name, icon: ach.icon })
        newAchievements.push(ach)
      }
    }

    await user.save()

    res.json({
      session,
      xpEarned,
      newAchievements,
      updatedStats: user.stats,
      newLevel: user.stats.level,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/game/history — Get user game history
router.get('/history', auth, async (req, res) => {
  try {
    const sessions = await GameSession.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .limit(20)
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/game/stats — Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stats achievements username avatar')

    // Stats by mode
    const byMode = await GameSession.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$mode', avgScore: { $avg: '$score' }, totalGames: { $sum: 1 }, bestScore: { $max: '$score' } } }
    ])

    res.json({ stats: user.stats, achievements: user.achievements, byMode })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router