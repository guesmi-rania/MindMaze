import React, { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { gameAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { COLORS, FONTS, GAME_MODES } from '../utils/theme'

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuthStore()
  const [byMode, setByMode] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    gameAPI.stats()
      .then(res => setByMode(res.data.byMode || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = user?.stats || {}
  const achievements = user?.achievements || []

  const handleLogout = () => logout()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Profile header */}
        <LinearGradient colors={['#7c3aed', '#4f46e5']} style={styles.profileHeader} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.avatar}>{user?.avatar || '🧠'}</Text>
          <Text style={styles.username}>{user?.username}</Text>
          <View style={styles.levelRow}>
            <Text style={styles.levelText}>Niveau {stats.level || 1}</Text>
            <Text style={styles.xpText}>{stats.xp || 0} XP</Text>
          </View>
        </LinearGradient>

        {/* Global stats */}
        <Text style={styles.sectionTitle}>Statistiques globales</Text>
        <View style={styles.statsGrid}>
          {[
            ['🏆', 'Meilleur score', stats.bestScore || 0],
            ['🎮', 'Parties totales', stats.totalGames || 0],
            ['🔥', 'Meilleure série', stats.bestStreak || 0],
            ['📊', 'Score total', stats.totalScore || 0],
          ].map(([icon, label, val]) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statIcon}>{icon}</Text>
              <Text style={styles.statValue}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Stats by mode */}
        <Text style={styles.sectionTitle}>Par mode de jeu</Text>
        {loading
          ? <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 20 }} />
          : GAME_MODES.map((mode) => {
              const m = byMode.find(b => b._id === mode.id)
              return (
                <View key={mode.id} style={styles.modeRow}>
                  <LinearGradient colors={mode.gradient} style={styles.modeIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Text style={{ fontSize: 20 }}>{mode.icon}</Text>
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modeName}>{mode.name}</Text>
                    <Text style={styles.modeStat}>
                      {m ? `${m.totalGames} parties • Meilleur: ${Math.round(m.bestScore)}` : 'Pas encore joué'}
                    </Text>
                  </View>
                </View>
              )
            })
        }

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Succès ({achievements.length})</Text>
        {achievements.length === 0
          ? <Text style={styles.emptyText}>Joue pour débloquer des succès !</Text>
          : (
            <View style={styles.achGrid}>
              {achievements.map((a) => (
                <View key={a.id} style={styles.achCard}>
                  <Text style={styles.achIcon}>{a.icon}</Text>
                  <Text style={styles.achName}>{a.name}</Text>
                </View>
              ))}
            </View>
          )
        }

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingBottom: 40 },
  profileHeader: { alignItems: 'center', paddingTop: 40, paddingBottom: 30, marginBottom: 24 },
  avatar: { fontSize: 72, marginBottom: 10 },
  username: { color: '#fff', fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black },
  levelRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  levelText: { color: 'rgba(255,255,255,0.9)', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  xpText: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.md },
  sectionTitle: { color: COLORS.text, fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, marginHorizontal: 20, marginBottom: 12, marginTop: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginHorizontal: 20 },
  statCard: {
    width: '47%', backgroundColor: COLORS.bgCard, borderRadius: 14,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  statIcon: { fontSize: 28, marginBottom: 6 },
  statValue: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.black },
  statLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2, textAlign: 'center' },
  modeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 20, backgroundColor: COLORS.bgCard,
    borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modeIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  modeName: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  modeStat: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, marginTop: 2 },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginHorizontal: 20 },
  achCard: {
    backgroundColor: 'rgba(124,58,237,0.15)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)',
    flexDirection: 'row', gap: 8,
  },
  achIcon: { fontSize: 22 },
  achName: { color: COLORS.accentLight, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.medium },
  emptyText: { color: COLORS.textMuted, marginHorizontal: 20, fontSize: FONTS.sizes.md },
  logoutBtn: {
    marginHorizontal: 20, marginTop: 32, borderRadius: 14,
    padding: 16, alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
  },
  logoutText: { color: '#ef4444', fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
})