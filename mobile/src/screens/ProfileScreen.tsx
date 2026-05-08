import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import type { UserProfile } from '../lib/types'

export function ProfileScreen() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProfile()
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#22c55e" size="large" />
      </View>
    )
  }

  if (!profile) return null

  const xpForNextLevel = profile.level * 500
  const xpPct = Math.min((profile.xp / xpForNextLevel) * 100, 100)
  const initials = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planText}>{profile.plan}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statBig}>{profile.level}</Text>
            <Text style={styles.statLabel}>{t('profile.level')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statBig, { color: '#f59e0b' }]}>{profile.xp}</Text>
            <Text style={styles.statLabel}>{t('profile.xp')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statBig, { color: '#f97316' }]}>🔥 {profile.streak}</Text>
            <Text style={styles.statLabel}>{t('profile.streak')} {t('profile.days')}</Text>
          </View>
        </View>

        <View style={styles.xpSection}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>{t('profile.xp')}: {profile.xp}</Text>
            <Text style={styles.xpLabel}>Próximo: {xpForNextLevel}</Text>
          </View>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${xpPct}%` as any }]} />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informações</Text>
        {[
          { label: t('profile.platform'), value: profile.platform },
          { label: t('profile.vehicle'), value: profile.vehicle },
        ].map(({ label, value }) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' },
  card: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#000' },
  name: { fontSize: 18, fontWeight: '700', color: '#f1f5f9' },
  email: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  planBadge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  planText: { fontSize: 11, color: '#22c55e', fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statBox: { alignItems: 'center' },
  statBig: { fontSize: 22, fontWeight: '700', color: '#f1f5f9' },
  statLabel: { fontSize: 11, color: '#8b9eb5', marginTop: 2 },
  xpSection: {},
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  xpLabel: { fontSize: 11, color: '#8b9eb5' },
  barBg: { height: 6, backgroundColor: '#334155', borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8b9eb5',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  infoLabel: { fontSize: 14, color: '#8b9eb5' },
  infoValue: { fontSize: 14, color: '#f1f5f9', fontWeight: '500' },
})
