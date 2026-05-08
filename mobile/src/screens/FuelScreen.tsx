import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'
import type { FuelEntry } from '../lib/types'

function fmt(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`
}

export function FuelScreen() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<FuelEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getFuel()
      .then(setEntries)
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
      data={entries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.fuel_type}</Text>
            </View>
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('fuel.liters')}</Text>
              <Text style={styles.statValue}>{item.liters}L</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>R$/L</Text>
              <Text style={styles.statValue}>{fmt(item.price_per_liter)}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('fuel.total')}</Text>
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>{fmt(item.total_cost)}</Text>
            </View>
          </View>
          <Text style={styles.station}>📍 {item.station}</Text>
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
  typeBadge: { backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  typeText: { fontSize: 11, color: '#22c55e', fontWeight: '600' },
  stats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 10, color: '#8b9eb5', marginBottom: 2 },
  statValue: { fontSize: 15, fontWeight: '600', color: '#f1f5f9' },
  station: { fontSize: 12, color: '#94a3b8' },
})
