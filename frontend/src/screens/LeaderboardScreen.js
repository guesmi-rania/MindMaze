import React, { useEffect, useState } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, TouchableOpacity, ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { leaderboardAPI } from '../services/api'
import { COLORS, FONTS } from '../utils/theme'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

function PlayerRow({ item }) {
  const isTop3 = item.rank <= 3
  return (
    <View style={[styles.row, item.isMe && styles.rowMe]}>
      <Text style={styles.rank}>
        {MEDALS[item.rank] || `#${item.rank}`}
      </Text>
      <Text style={styles.avatar}>{item.avatar}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, item.isMe && styles.nameMe]}>{item.username}</Text>
        <Text style={styles.sub}>Niv. {item.level} • {item.totalGames} parties</Text>
      </View>
      <View style={styles.scoreWrap}>
        <Text style={[styles.score, isTop3 && { color: COLORS.neon }]}>{item.bestScore}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </View>
  )
}

export default function LeaderboardScreen() {
  const [tab, setTab] = useState('global') // 'global' | 'weekly'
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fetch = tab === 'global' ? leaderboardAPI.global() : leaderboardAPI.weekly()
    fetch
      .then(res => setData(res.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1a1a24', COLORS.bg]} style={styles.header}>
        <Text style={styles.title}>🏆 Classement</Text>
        <View style={styles.tabs}>
          {['global', 'weekly'].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'global' ? '🌍 Mondial' : '📅 Cette semaine'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {loading
        ? <ActivityIndicator color={COLORS.accent} style={{ marginTop: 60 }} size="large" />
        : data.length === 0
          ? <Text style={styles.empty}>Aucun joueur encore 😅</Text>
          : (
            <FlatList
              data={data}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => <PlayerRow item={item} />}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 20, paddingBottom: 16 },
  title: { color: COLORS.text, fontSize: FONTS.sizes.xxl, fontWeight: FONTS.weights.black, marginBottom: 16 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: COLORS.accent },
  tabText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.medium },
  tabTextActive: { color: '#fff' },
  list: { padding: 16, gap: 10 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  rowMe: { borderColor: COLORS.accent, backgroundColor: 'rgba(124,58,237,0.1)' },
  rank: { fontSize: 22, width: 36, textAlign: 'center' },
  avatar: { fontSize: 28 },
  name: { color: COLORS.text, fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
  nameMe: { color: COLORS.accentLight },
  sub: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  scoreWrap: { alignItems: 'flex-end' },
  score: { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weights.black },
  scoreLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs },
  empty: { color: COLORS.textMuted, textAlign: 'center', marginTop: 60, fontSize: FONTS.sizes.lg },
})