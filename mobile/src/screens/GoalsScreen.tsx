import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import type { Goal } from '../lib/types'

function fmtValue(v: number, type: string) {
  if (type === 'earnings' || type === 'fuel') return `R$ ${v.toFixed(2).replace('.', ',')}`
  if (type === 'km') return `${v} km`
  return `${v}`
}

export function GoalsScreen() {
  const { t } = useTranslation()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getGoals()
      .then(setGoals)
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {goals.map((g) => {
        const pct = Math.min((g.current_value / g.target_value) * 100, 100)
        const done = pct >= 100
        return (
          <View key={g.id} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>{g.title}</Text>
              <View style={[styles.badge, { backgroundColor: done ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)' }]}>
                <Text style={[styles.badgeText, { color: done ? '#22c55e' : '#3b82f6' }]}>
                  {done ? t('goals.completed') : t('goals.inProgress')}
                </Text>
              </View>
            </View>
            <View style={styles.valuesRow}>
              <Text style={styles.valLabel}>{t('goals.current')}: <Text style={styles.valValue}>{fmtValue(g.current_value, g.type)}</Text></Text>
              <Text style={styles.valLabel}>{t('goals.target')}: <Text style={styles.valValue}>{fmtValue(g.target_value, g.type)}</Text></Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: done ? '#22c55e' : '#3b82f6' }]} />
            </View>
            <View style={styles.pctRow}>
              <Text style={styles.deadline}>Prazo: {g.deadline}</Text>
              <Text style={styles.pct}>{pct.toFixed(1)}%</Text>
            </View>
          </View>
        )
      })}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 15, fontWeight: '600', color: '#f1f5f9' },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  valuesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  valLabel: { fontSize: 12, color: '#8b9eb5' },
  valValue: { color: '#f1f5f9', fontWeight: '600' },
  barBg: { height: 8, backgroundColor: '#334155', borderRadius: 4, marginBottom: 6 },
  barFill: { height: 8, borderRadius: 4 },
  pctRow: { flexDirection: 'row', justifyContent: 'space-between' },
  deadline: { fontSize: 11, color: '#8b9eb5' },
  pct: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
})
