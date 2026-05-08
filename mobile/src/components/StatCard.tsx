import { View, Text, StyleSheet } from 'react-native'

const colors = {
  green: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
  blue: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
  purple: { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6' },
  teal: { bg: 'rgba(20,184,166,0.1)', text: '#14b8a6' },
  warn: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
  danger: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
}

interface StatCardProps {
  label: string
  value: string
  icon: string
  color?: keyof typeof colors
  sub?: string
}

export function StatCard({ label, value, icon, color = 'green', sub }: StatCardProps) {
  const c = colors[color]
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: c.bg }]}>
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {sub && <Text style={styles.sub}>{sub}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    flex: 1,
    minWidth: 140,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: '#8b9eb5',
    fontWeight: '500',
    marginBottom: 3,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  sub: {
    fontSize: 11,
    color: '#8b9eb5',
    marginTop: 2,
  },
})
