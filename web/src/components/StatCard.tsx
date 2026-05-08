interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon: string
  color?: 'green' | 'blue' | 'purple' | 'teal' | 'warn' | 'danger'
}

const colorMap = {
  green: { bg: 'bg-green-500/10', text: 'text-green-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400' },
  warn: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  danger: { bg: 'bg-red-500/10', text: 'text-red-400' },
}

export function StatCard({ label, value, sub, icon, color = 'green' }: StatCardProps) {
  const c = colorMap[color]
  return (
    <div className="bg-gc-dark2 border border-gc-border rounded-xl p-4 hover:-translate-y-0.5 transition-transform">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-3 ${c.bg} ${c.text}`}>
        {icon}
      </div>
      <p className="text-xs text-gc-text3 font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gc-text">{value}</p>
      {sub && <p className="text-xs text-gc-text3 mt-1">{sub}</p>}
    </div>
  )
}
