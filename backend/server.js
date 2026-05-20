const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const gameRoutes = require('./routes/game')
const leaderboardRoutes = require('./routes/leaderboard')

const app = express()

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ MongoDB erreur:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'MindMaze API' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 MindMaze API démarrée sur :${PORT}`))