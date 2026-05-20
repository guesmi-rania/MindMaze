import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuthStore } from '../store/authStore'
import { COLORS, FONTS, GAME_MODES } from '../utils/theme'

function LevelBar({ xp }) {
  const level = Math.floor(xp / 200) + 1
  const progress = (xp % 200) / 200
  return (
    <View style={styles.levelBarWrap}>
      <View style={styles.levelBarBg}>
        <LinearGradient
          colors={['#7c3aed', '#00f5d4']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={[styles.levelBarFill, { width: `${progress * 100}%` }]}
        />
      </View>
      <Text style={styles.levelBarText}>{Math.round(progress * 100)}% → Niv. {level + 1}</Text>
    </View>
  )
}

export default function HomeScreen({ navigation }) {
  const user = useAuthStore((s) => s.user)
  const stats = user?.stats || {}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.username}>{user?.avatar} {user?.username}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Niv. {stats.level || 1}</Text>
          </View>
        </View>

        {/* XP Bar */}
        <LevelBar xp={stats.xp || 0} />

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Meilleur score', value: stats.bestScore || 0, icon: '🏆' },
            { label: 'Parties jouées', value: stats.totalGames || 0, icon: '🎮' },
            { label: 'Série max', value: stats.bestStreak || 0, icon: '🔥' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Game modes */}
        <Text style={styles.sectionTitle}>Choisir un mode</Text>
        <View style={styles.modesGrid}>
          {GAME_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={styles.modeCard}
              onPress={() => navigation.navigate('Game', { mode })}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={mode.gradient}
                style={styles.modeGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <Text style={styles.modeIcon}>{mode.icon}</Text>
              </LinearGradient>
              <Text style={styles.modeName}>{mode.name}</Text>
              <Text style={styles.modeDesc}>{mode.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily challenge */}
        <TouchableOpacity
          style={styles.dailyCard}
          onPress={() => navigation.navigate('Game', { mode: GAME_MODES[0], daily: true })}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#f59e0b', '#f97316']} style={styles.dailyGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <View>
              <Text style={styles.dailyBadge}>🌟 DÉFI DU JOUR</Text>
              <Text style={styles.dailyTitle}>Relève le défi quotidien</Text>
              <Text style={styles.dailySub}>Bonus XP ×3 aujourd'hui !</Text>
            </View>
            <Text style={{ fontSize: 48 }}>⚡</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { color: COLORS.textMuted, fontSize: FONTS.sizes.md },
  username: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.bold },
  levelBadge: {
    backgroundColor: 'rgba(124,58,237,0.2)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.accent,
  },
  levelText: { color: COLORS.accentLight, fontWeight: FONTS.weights.bold, fontSize: FONTS.sizes.sm },
  levelBarWrap: { marginBottom: 24 },
  levelBarBg: { height: 6, backgroundColor: COLORS.bgCard, borderRadius: 3, overflow: 'hidden' },
  levelBarFill: { height: '100%', borderRadius: 3 },
  levelBarText: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1, backgroundColor: COLORS.bgCard,
    borderRadius: 14, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statValue: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.black },
  statLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, textAlign: 'center', marginTop: 2 },
  sectionTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, marginBottom: 14 },
  modesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  modeCard: {
    width: '47%',
    backgroundColor: COLORS.bgCard,
    borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modeGradient: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  modeIcon: { fontSize: 26 },
  modeName: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, marginBottom: 4 },
  modeDesc: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, lineHeight: 16 },
  dailyCard: { borderRadius: 18, overflow: 'hidden', marginBottom: 10 },
  dailyGradient: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  dailyBadge: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold, marginBottom: 4 },
  dailyTitle: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.black },
  dailySub: { color: 'rgba(255,255,255,0.85)', fontSize: FONTS.sizes.sm, marginTop: 2 },
})