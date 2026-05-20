import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Animated, Vibration, Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { gameAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { COLORS, FONTS } from '../utils/theme'

// ── Helpers ────────────────────────────────────────────────
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// ── MATH GAME ─────────────────────────────────────────────
function MathGame({ level, onCorrect, onWrong }) {
  const [question, setQuestion] = useState(null)
  const [options, setOptions] = useState([])

  const generateQuestion = useCallback(() => {
    const ops = ['+', '-', '×']
    const op = ops[randomInt(0, level > 3 ? 2 : 1)]
    let a, b, answer
    if (op === '+') { a = randomInt(1, 10 * level); b = randomInt(1, 10 * level); answer = a + b }
    else if (op === '-') { a = randomInt(5, 10 * level); b = randomInt(1, a); answer = a - b }
    else { a = randomInt(1, 5 + level); b = randomInt(1, 5 + level); answer = a * b }

    const wrong = new Set()
    while (wrong.size < 3) {
      const w = answer + randomInt(-10, 10)
      if (w !== answer && w > 0) wrong.add(w)
    }
    setQuestion({ text: `${a} ${op} ${b}`, answer })
    setOptions(shuffle([answer, ...wrong]))
  }, [level])

  useEffect(() => { generateQuestion() }, [generateQuestion])

  const handleAnswer = (val) => {
    if (val === question.answer) { onCorrect(); generateQuestion() }
    else { onWrong() }
  }

  if (!question) return null
  return (
    <View style={styles.gameCenter}>
      <Text style={styles.mathQuestion}>{question.text} = ?</Text>
      <View style={styles.mathGrid}>
        {options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.mathBtn} onPress={() => handleAnswer(opt)}>
            <Text style={styles.mathBtnText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

// ── MEMORY GAME ───────────────────────────────────────────
function MemoryGame({ level, onCorrect, onWrong }) {
  const EMOJIS = ['🍎','🌟','🎯','🔥','⚡','🌈','🎲','💎','🚀','🎭','🦁','🐬']
  const size = Math.min(3 + Math.floor(level / 2), 6)
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [solved, setSolved] = useState([])
  const [locked, setLocked] = useState(false)
  const [showing, setShowing] = useState(true)

  useEffect(() => {
    const pool = EMOJIS.slice(0, size)
    const deck = shuffle([...pool, ...pool]).map((emoji, i) => ({ id: i, emoji }))
    setCards(deck)
    setFlipped(deck.map(c => c.id))
    setSolved([])
    setTimeout(() => setFlipped([]), 2000 + level * 300)
    setTimeout(() => setShowing(false), 2000 + level * 300)
  }, [level])

  const handleFlip = (card) => {
    if (locked || showing || flipped.includes(card.id) || solved.includes(card.id)) return
    const newFlipped = [...flipped, card.id]
    setFlipped(newFlipped)
    if (newFlipped.length === 2) {
      setLocked(true)
      const [a, b] = newFlipped.map(id => cards.find(c => c.id === id))
      if (a.emoji === b.emoji) {
        const newSolved = [...solved, a.id, b.id]
        setSolved(newSolved)
        setFlipped([])
        setLocked(false)
        if (newSolved.length === cards.length) onCorrect()
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); onWrong() }, 800)
      }
    }
  }

  return (
    <View style={styles.gameCenter}>
      {showing && <Text style={styles.memoryHint}>Mémorise !</Text>}
      <View style={[styles.memoryGrid, { width: size * 64 }]}>
        {cards.map((card) => {
          const isVisible = flipped.includes(card.id) || solved.includes(card.id)
          return (
            <TouchableOpacity
              key={card.id}
              style={[styles.memoryCard, isVisible && styles.memoryCardFlipped]}
              onPress={() => handleFlip(card)}
            >
              <Text style={styles.memoryEmoji}>{isVisible ? card.emoji : '?'}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

// ── SEQUENCE GAME ─────────────────────────────────────────
function SequenceGame({ level, onCorrect, onWrong }) {
  const COLORS_SEQ = ['#ef4444','#3b82f6','#22c55e','#f59e0b']
  const [sequence, setSequence] = useState([])
  const [playerSeq, setPlayerSeq] = useState([])
  const [activeColor, setActiveColor] = useState(null)
  const [playerTurn, setPlayerTurn] = useState(false)

  const generateSequence = useCallback(() => {
    const len = 3 + level
    const seq = Array.from({ length: len }, () => randomInt(0, 3))
    setSequence(seq)
    setPlayerSeq([])
    setPlayerTurn(false)
    playSequence(seq)
  }, [level])

  const playSequence = (seq) => {
    seq.forEach((colorIdx, i) => {
      setTimeout(() => setActiveColor(colorIdx), i * 700)
      setTimeout(() => setActiveColor(null), i * 700 + 400)
    })
    setTimeout(() => setPlayerTurn(true), seq.length * 700 + 500)
  }

  useEffect(() => { generateSequence() }, [generateSequence])

  const handlePress = (colorIdx) => {
    if (!playerTurn) return
    const newSeq = [...playerSeq, colorIdx]
    setPlayerSeq(newSeq)
    const correct = sequence[newSeq.length - 1] === colorIdx
    if (!correct) { onWrong(); return }
    if (newSeq.length === sequence.length) { onCorrect(); generateSequence() }
  }

  return (
    <View style={styles.gameCenter}>
      <Text style={styles.seqHint}>{playerTurn ? 'Reproduis la séquence !' : 'Observe...'}</Text>
      <View style={styles.seqGrid}>
        {COLORS_SEQ.map((color, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.seqBtn, { backgroundColor: color }, activeColor === i && styles.seqBtnActive]}
            onPress={() => handlePress(i)}
          />
        ))}
      </View>
    </View>
  )
}

// ── SPEED GAME ────────────────────────────────────────────
function SpeedGame({ level, onCorrect, onWrong }) {
  const [target, setTarget] = useState(null)
  const [decoys, setDecoys] = useState([])
  const [timeLeft, setTimeLeft] = useState(3000)
  const timerRef = useRef(null)

  const EMOJIS = ['🍎','🌟','🎯','🔥','⚡','🌈','🎲','💎','🚀','🎭']

  const generateRound = useCallback(() => {
    clearInterval(timerRef.current)
    const t = EMOJIS[randomInt(0, EMOJIS.length - 1)]
    const pool = EMOJIS.filter(e => e !== t)
    const d = shuffle(pool).slice(0, 3 + Math.min(level, 4))
    setTarget(t)
    setDecoys(shuffle([t, ...d]))
    setTimeLeft(Math.max(1000, 3000 - level * 200))
  }, [level])

  useEffect(() => { generateRound() }, [generateRound])

  useEffect(() => {
    if (!timeLeft) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) { clearInterval(timerRef.current); onWrong(); return 0 }
        return prev - 100
      })
    }, 100)
    return () => clearInterval(timerRef.current)
  }, [target])

  const handlePress = (emoji) => {
    clearInterval(timerRef.current)
    if (emoji === target) { onCorrect(); generateRound() }
    else { onWrong() }
  }

  return (
    <View style={styles.gameCenter}>
      <Text style={styles.speedInstruction}>Touche le : <Text style={styles.speedTarget}>{target}</Text></Text>
      <View style={[styles.speedBar, { width: `${(timeLeft / 3000) * 100}%` }]} />
      <View style={styles.speedGrid}>
        {decoys.map((emoji, i) => (
          <TouchableOpacity key={i} style={styles.speedBtn} onPress={() => handlePress(emoji)}>
            <Text style={styles.speedEmoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

// ═══════════════════════════════════════════════════════
// MAIN GAME SCREEN
// ═══════════════════════════════════════════════════════
export default function GameScreen({ route, navigation }) {
  const { mode } = route.params
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong'
  const [gameOver, setGameOver] = useState(false)
  const [saving, setSaving] = useState(false)
  const startTime = useRef(Date.now())
  const updateUser = useAuthStore((s) => s.updateUser)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleCorrect = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    const newStreak = streak + 1
    const bonus = Math.floor(newStreak / 3) * 5
    const points = 10 + level * 5 + bonus
    setScore(s => s + points)
    setStreak(newStreak)
    setCorrect(c => c + 1)
    setFeedback('correct')
    if ((correct + 1) % 5 === 0) setLevel(l => l + 1)
    setTimeout(() => setFeedback(null), 500)
  }

  const handleWrong = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    setStreak(0)
    setWrong(w => w + 1)
    setFeedback('wrong')
    const newLives = lives - 1
    setLives(newLives)
    setTimeout(() => setFeedback(null), 500)
    if (newLives <= 0) endGame()
  }

  const endGame = async () => {
    setGameOver(true)
    setSaving(true)
    try {
      const res = await gameAPI.saveSession({
        mode: mode.id, score, level, streak, correctAnswers: correct,
        wrongAnswers: wrong, timeSpent,
      })
      if (res.data?.newAchievements?.length > 0) {
        const names = res.data.newAchievements.map(a => `${a.icon} ${a.name}`).join('\n')
        Alert.alert('🏆 Succès débloqué !', names)
      }
      if (res.data?.updatedStats) {
        updateUser({ stats: res.data.updatedStats })
      }
    } catch (e) {
      console.log('Save error:', e)
    } finally {
      setSaving(false)
    }
  }

  const renderGame = () => {
    const props = { level, onCorrect: handleCorrect, onWrong: handleWrong }
    switch (mode.id) {
      case 'math':     return <MathGame {...props} />
      case 'memory':   return <MemoryGame {...props} />
      case 'sequence': return <SequenceGame {...props} />
      case 'speed':    return <SpeedGame {...props} />
      default:         return <MathGame {...props} />
    }
  }

  if (gameOver) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverEmoji}>🎯</Text>
          <Text style={styles.gameOverTitle}>Partie terminée !</Text>
          <View style={styles.resultCard}>
            {[
              ['Score', score, '⭐'],
              ['Niveau atteint', level, '📈'],
              ['Meilleure série', streak, '🔥'],
              ['Bonnes réponses', correct, '✅'],
              ['Temps', `${timeSpent}s`, '⏱️'],
            ].map(([label, val, icon]) => (
              <View key={label} style={styles.resultRow}>
                <Text style={styles.resultIcon}>{icon}</Text>
                <Text style={styles.resultLabel}>{label}</Text>
                <Text style={styles.resultValue}>{val}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.replayBtn}
            onPress={() => navigation.replace('Game', { mode })}
          >
            <LinearGradient colors={mode.gradient} style={styles.replayGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.replayText}>Rejouer</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.homeBtnText}>← Accueil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[
      styles.container,
      feedback === 'correct' && { backgroundColor: 'rgba(16,185,129,0.08)' },
      feedback === 'wrong'   && { backgroundColor: 'rgba(239,68,68,0.08)' },
    ]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <Text style={styles.modeLabel}>{mode.icon} {mode.name}</Text>
          <Text style={styles.levelLabel}>Niveau {level}</Text>
        </View>
        <View style={styles.lives}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Text key={i} style={{ fontSize: 18, opacity: i < lives ? 1 : 0.2 }}>❤️</Text>
          ))}
        </View>
      </View>

      {/* Score bar */}
      <View style={styles.scoreBar}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={[styles.scoreValue, { color: streak > 0 ? '#f59e0b' : COLORS.text }]}>
            {streak} 🔥
          </Text>
          <Text style={styles.scoreLabel}>Série</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreValue}>{timeSpent}s</Text>
          <Text style={styles.scoreLabel}>Temps</Text>
        </View>
      </View>

      {/* Feedback */}
      {feedback && (
        <View style={[styles.feedbackBanner, feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong]}>
          <Text style={styles.feedbackText}>{feedback === 'correct' ? '✅ Correct !' : '❌ Raté !'}</Text>
        </View>
      )}

      {/* Game content */}
      <View style={styles.gameArea}>
        {renderGame()}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { color: COLORS.textMuted, fontSize: 16 },
  topCenter: { alignItems: 'center' },
  modeLabel: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  levelLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  lives: { flexDirection: 'row', gap: 4 },
  scoreBar: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: COLORS.bgCard, marginHorizontal: 16,
    borderRadius: 14, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  scoreItem: { alignItems: 'center' },
  scoreValue: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.black },
  scoreLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  feedbackBanner: { marginHorizontal: 16, borderRadius: 10, padding: 10, alignItems: 'center', marginBottom: 8 },
  feedbackCorrect: { backgroundColor: 'rgba(16,185,129,0.2)' },
  feedbackWrong: { backgroundColor: 'rgba(239,68,68,0.2)' },
  feedbackText: { color: COLORS.text, fontWeight: FONTS.weights.bold },
  gameArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  gameCenter: { alignItems: 'center', width: '100%' },

  // Math
  mathQuestion: { color: COLORS.text, fontSize: FONTS.sizes.hero, fontWeight: FONTS.weights.black, marginBottom: 32 },
  mathGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
  mathBtn: {
    width: 120, height: 64, backgroundColor: COLORS.bgCard,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  mathBtnText: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold },

  // Memory
  memoryHint: { color: COLORS.neon, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, marginBottom: 20 },
  memoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  memoryCard: {
    width: 56, height: 56, borderRadius: 12,
    backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  memoryCardFlipped: { backgroundColor: 'rgba(124,58,237,0.2)', borderColor: COLORS.accent },
  memoryEmoji: { fontSize: 28 },

  // Sequence
  seqHint: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, marginBottom: 30 },
  seqGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  seqBtn: { width: 100, height: 100, borderRadius: 20 },
  seqBtnActive: { opacity: 0.4, transform: [{ scale: 0.92 }] },

  // Speed
  speedInstruction: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold, marginBottom: 16 },
  speedTarget: { fontSize: 40 },
  speedBar: { height: 6, backgroundColor: COLORS.neon, borderRadius: 3, marginBottom: 30, alignSelf: 'flex-start' },
  speedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
  speedBtn: {
    width: 72, height: 72, borderRadius: 16,
    backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  speedEmoji: { fontSize: 36 },

  // Game Over
  gameOverContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  gameOverEmoji: { fontSize: 80, marginBottom: 12 },
  gameOverTitle: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black, marginBottom: 24 },
  resultCard: {
    width: '100%', backgroundColor: COLORS.bgCard,
    borderRadius: 18, padding: 20, gap: 14,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 24,
  },
  resultRow: { flexDirection: 'row', alignItems: 'center' },
  resultIcon: { fontSize: 20, width: 32 },
  resultLabel: { color: COLORS.textSub, fontSize: FONTS.sizes.md, flex: 1 },
  resultValue: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },
  replayBtn: { width: '100%', borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  replayGradient: { paddingVertical: 16, alignItems: 'center' },
  replayText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },
  homeBtn: { paddingVertical: 12 },
  homeBtnText: { color: COLORS.textMuted, fontSize: FONTS.sizes.md },
})