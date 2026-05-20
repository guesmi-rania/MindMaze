import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, ScrollView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuthStore } from '../store/authStore'
import { COLORS, FONTS } from '../utils/theme'

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('🧠')

  const { login, register, isLoading, error, clearError } = useAuthStore()

  const AVATARS = ['🧠', '🦊', '🐉', '🦁', '🐺', '🦅', '🐬', '🦄', '👾', '🤖', '👻', '🎭']

  const handleSubmit = async () => {
    clearError()
    if (mode === 'login') {
      const ok = await login(email.trim(), password)
      if (!ok) Alert.alert('Erreur', error || 'Identifiants incorrects')
    } else {
      if (!username.trim()) return Alert.alert('Erreur', 'Le pseudo est requis')
      const ok = await register(username.trim(), email.trim(), password, selectedAvatar)
      if (!ok) Alert.alert('Erreur', error || 'Inscription échouée')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🧩</Text>
          <Text style={styles.title}>MindMaze</Text>
          <Text style={styles.subtitle}>Teste ton cerveau, bats les records</Text>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'register' && styles.tabActive]}
            onPress={() => setMode('register')}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Inscription</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'register' && (
            <>
              <Text style={styles.label}>Pseudo</Text>
              <TextInput
                style={styles.input}
                placeholder="TonPseudo"
                placeholderTextColor={COLORS.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

              <Text style={styles.label}>Choisis ton avatar</Text>
              <View style={styles.avatarGrid}>
                {AVATARS.map((av) => (
                  <TouchableOpacity
                    key={av}
                    style={[styles.avatarBtn, selectedAvatar === av && styles.avatarBtnActive]}
                    onPress={() => setSelectedAvatar(av)}
                  >
                    <Text style={styles.avatarEmoji}>{av}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="ton@email.com"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={styles.btnWrapper}>
            <LinearGradient colors={['#7c3aed', '#4f46e5']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {isLoading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: FONTS.sizes.hero, fontWeight: FONTS.weights.black, color: COLORS.text, letterSpacing: -1 },
  subtitle: { fontSize: FONTS.sizes.md, color: COLORS.textMuted, marginTop: 6 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.accent },
  tabText: { color: COLORS.textMuted, fontWeight: FONTS.weights.medium, fontSize: FONTS.sizes.md },
  tabTextActive: { color: '#fff' },
  form: { gap: 8 },
  label: { color: COLORS.textSub, fontSize: FONTS.sizes.sm, marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: FONTS.sizes.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  avatarBtn: {
    width: 52, height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  avatarBtnActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(124,58,237,0.15)' },
  avatarEmoji: { fontSize: 26 },
  btnWrapper: { marginTop: 24 },
  btn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold },
})