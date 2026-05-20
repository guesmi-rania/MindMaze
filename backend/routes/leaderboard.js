const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/User')

// GET /api/leaderboard/global — Top 50 players by best score
router.get('/global', auth, async (req, res) => {
  try {
    const players = await User.find({})
      .select('username avatar stats.bestScore stats.totalGames stats.level stats.bestStreak')
      .sort({ 'stats.bestScore': -1 })
      .limit(50)

    const leaderboard = players.map((p, index) => ({
      rank: index + 1,
      username: p.username,
      avatar: p.avatar,
      bestScore: p.stats.bestScore,
      totalGames: p.stats.totalGames,
      level: p.stats.level,
      bestStreak: p.stats.bestStreak,
      isMe: p._id.toString() === req.user._id.toString(),
    }))

    res.json(leaderboard)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/leaderboard/weekly — Top by score this week
router.get('/weekly', auth, async (req, res) => {
  try {
    const GameSession = require('../models/GameSession')
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const top = await GameSession.aggregate([
      { $match: { completedAt: { $gte: weekAgo } } },
      { $group: { _id: '$user', weeklyScore: { $sum: '$score' }, games: { $sum: 1 } } },
      { $sort: { weeklyScore: -1 } },
      { $limit: 50 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          avatar: '$user.avatar',
          level: '$user.stats.level',
          weeklyScore: 1,
          games: 1,
        }
      }
    ])

    const leaderboard = top.map((p, i) => ({
      rank: i + 1,
      ...p,
      isMe: p._id?.toString() === req.user._id.toString(),
    }))

    res.json(leaderboard)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router