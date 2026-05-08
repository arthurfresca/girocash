import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { StatCard } from '../components/StatCard'
import { api } from '../lib/api'
import type { DashboardSummary } from '../lib/types'

function fmt(v: number) {
  return `R$ ${v.toFixed(2).replace('.', ',')}`
}

export function DashboardScreen() {
  const { t } = useTranslation()
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#22c55e" size="large" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    )
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('common.error')}</Text>
      </View>
    )
  }

  const { today, week, month } = data

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('dashboard.today')}</Text>
        <View style={styles.row}>
          <StatCard label={t('dashboard.grossEarnings')} value={fmt(today.gross_earnings)} icon="💰" color="green" />
          <StatCard label={t('dashboard.netProfit')} value={fmt(today.net_profit)} icon="📈" color="teal" />
        </View>
        <View style={styles.row}>
          <StatCard label={t('dashboard.kmDriven')} value={`${today.km_driven} km`} icon="🛣️" color="blue" />
          <StatCard label={t('dashboard.rideCount')} value={`${today.ride_count}`} icon="🚗" color="purple" />
        </View>
        <View style={styles.row}>
          <StatCard label={t('dashboard.fuelCost')} value={fmt(today.fuel_cost)} icon="⛽" color="warn" />
          <StatCard label={t('dashboard.hoursWorked')} value={`${today.hours_worked}h`} icon="⏱️" color="blue" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('dashboard.thisWeek')}</Text>
        <View style={styles.row}>
          <StatCard label={t('dashboard.grossEarnings')} value={fmt(week.gross_earnings)} icon="💰" color="green" />
          <StatCard label={t('dashboard.netProfit')} value={fmt(week.net_profit)} icon="📈" color="teal" />
        </View>
        <View style={styles.row}>
          <StatCard label={t('dashboard.kmDriven')} value={`${week.km_driven} km`} icon="🛣️" color="blue" />
          <StatCard label={t('dashboard.rideCount')} value={`${week.ride_count}`} icon="🚗" color="purple" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('dashboard.thisMonth')}</Text>
        <View style={styles.row}>
          <StatCard label={t('dashboard.grossEarnings')} value={fmt(month.gross_earnings)} icon="💰" color="green" />
          <StatCard label={t('dashboard.netProfit')} value={fmt(month.net_profit)} icon="📈" color="teal" />
        </View>
        <View style={styles.row}>
          <StatCard label={t('dashboard.kmDriven')} value={`${month.km_driven} km`} icon="🛣️" color="blue" />
          <StatCard label={t('dashboard.rideCount')} value={`${month.ride_count}`} icon="🚗" color="purple" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('dashboard.thisMonth')} — Despesas</Text>
        {data.charts.expense_breakdown.map((slice) => {
          const total = data.charts.expense_breakdown.reduce((s, e) => s + e.value, 0)
          const pct = ((slice.value / total) * 100).toFixed(1)
          return (
            <View key={slice.label} style={styles.expenseRow}>
              <View style={styles.expenseHeader}>
                <Text style={styles.expenseLabel}>{slice.label}</Text>
                <Text style={styles.expenseValue}>{fmt(slice.value)} ({pct}%)</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: slice.color }]} />
              </View>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' },
  loadingText: { color: '#94a3b8', marginTop: 8 },
  errorText: { color: '#ef4444' },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8b9eb5',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  expenseRow: { marginBottom: 12 },
  expenseHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  expenseLabel: { fontSize: 13, color: '#94a3b8' },
  expenseValue: { fontSize: 13, color: '#f1f5f9', fontWeight: '500' },
  barBg: { height: 6, backgroundColor: '#334155', borderRadius: 3 },
  barFill: { height: 6, borderRadius: 3 },
})
