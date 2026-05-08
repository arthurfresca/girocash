import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import type { Workday } from '../lib/types'

function fmt(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`
}

export function WorkdaysScreen() {
  const { t } = useTranslation()
  const [workdays, setWorkdays] = useState<Workday[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getWorkdays()
      .then(setWorkdays)
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
    <FlatList
      style={styles.container}
      data={workdays}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.platformBadge}>
              <Text style={styles.platformText}>{item.platform}</Text>
            </View>
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('workdays.gross')}</Text>
              <Text style={[styles.statValue, { color: '#22c55e' }]}>{fmt(item.gross_earnings)}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('workdays.net')}</Text>
              <Text style={[styles.statValue, { color: '#14b8a6' }]}>{fmt(item.net_profit)}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('workdays.km')}</Text>
              <Text style={styles.statValue}>{item.km_driven} km</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('workdays.rides')}</Text>
              <Text style={styles.statValue}>{item.ride_count}</Text>
            </View>
          </View>
        </View>
      )}
    />
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
    padding: 14,
    marginBottom: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  date: { fontSize: 14, fontWeight: '600', color: '#f1f5f9' },
  platformBadge: { backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  platformText: { fontSize: 11, color: '#22c55e', fontWeight: '600' },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#8b9eb5', marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: '600', color: '#f1f5f9' },
})
