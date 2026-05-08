import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { TopBar } from '@/components/TopBar'
import { StatCard } from '@/components/StatCard'
import { api } from '@/lib/api'

function fmt(value: number) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

export default async function DashboardPage() {
  const t = await getTranslations('dashboard')
  const tCommon = await getTranslations('common')

  let data = null
  try {
    data = await api.getDashboard()
  } catch {
    // fall through to show error state
  }

  if (!data) {
    return (
      <div>
        <TopBar title={t('title')} />
        <div className="p-6 text-gc-text3">{tCommon('error')}</div>
      </div>
    )
  }

  const { today, week, month } = data

  return (
    <div>
      <TopBar title={t('title')} />
      <div className="p-6 space-y-6">

        <section>
          <h2 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider mb-3">{t('today')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label={t('grossEarnings')} value={fmt(today.gross_earnings)} icon="💰" color="green" />
            <StatCard label={t('netProfit')} value={fmt(today.net_profit)} icon="📈" color="teal" />
            <StatCard label={t('kmDriven')} value={`${today.km_driven} km`} icon="🛣️" color="blue" />
            <StatCard label={t('hoursWorked')} value={`${today.hours_worked}h`} icon="⏱️" color="purple" />
            <StatCard label={t('fuelCost')} value={fmt(today.fuel_cost)} icon="⛽" color="warn" />
            <StatCard label={t('rideCount')} value={`${today.ride_count}`} icon="🚗" color="blue" />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider mb-3">{t('thisWeek')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label={t('grossEarnings')} value={fmt(week.gross_earnings)} icon="💰" color="green" />
            <StatCard label={t('netProfit')} value={fmt(week.net_profit)} icon="📈" color="teal" />
            <StatCard label={t('kmDriven')} value={`${week.km_driven} km`} icon="🛣️" color="blue" />
            <StatCard label={t('hoursWorked')} value={`${week.hours_worked}h`} icon="⏱️" color="purple" />
            <StatCard label={t('fuelCost')} value={fmt(week.fuel_cost)} icon="⛽" color="warn" />
            <StatCard label={t('rideCount')} value={`${week.ride_count}`} icon="🚗" color="blue" />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider mb-3">{t('thisMonth')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label={t('grossEarnings')} value={fmt(month.gross_earnings)} icon="💰" color="green" />
            <StatCard label={t('netProfit')} value={fmt(month.net_profit)} icon="📈" color="teal" />
            <StatCard label={t('kmDriven')} value={`${month.km_driven} km`} icon="🛣️" color="blue" />
            <StatCard label={t('hoursWorked')} value={`${month.hours_worked}h`} icon="⏱️" color="purple" />
            <StatCard label={t('fuelCost')} value={fmt(month.fuel_cost)} icon="⛽" color="warn" />
            <StatCard label={t('rideCount')} value={`${month.ride_count}`} icon="🚗" color="blue" />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider mb-3">{t('dailyChart')}</h2>
          <div className="bg-gc-dark2 border border-gc-border rounded-xl p-4 overflow-x-auto">
            <div className="flex items-end gap-4 h-40 min-w-[400px]">
              {data.charts.daily_earnings.map((point) => {
                const maxVal = Math.max(...data.charts.daily_earnings.map((p) => p.gross || 0))
                const grossH = maxVal ? (point.gross / maxVal) * 100 : 0
                const netH = maxVal ? (point.net / maxVal) * 100 : 0
                return (
                  <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-0.5 h-32">
                      <div
                        className="flex-1 bg-green-500/30 rounded-t-sm transition-all"
                        style={{ height: `${grossH}%` }}
                        title={`Bruto: R$ ${point.gross}`}
                      />
                      <div
                        className="flex-1 bg-blue-500/50 rounded-t-sm transition-all"
                        style={{ height: `${netH}%` }}
                        title={`Líquido: R$ ${point.net}`}
                      />
                    </div>
                    <span className="text-xs text-gc-text3">{point.label}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-gc-text3">
                <span className="w-3 h-3 rounded-sm bg-green-500/30 inline-block" />
                {t('grossEarnings')}
              </span>
              <span className="flex items-center gap-1 text-xs text-gc-text3">
                <span className="w-3 h-3 rounded-sm bg-blue-500/50 inline-block" />
                {t('netProfit')}
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider mb-3">{t('expenseChart')}</h2>
          <div className="bg-gc-dark2 border border-gc-border rounded-xl p-4">
            <div className="space-y-3">
              {data.charts.expense_breakdown.map((slice) => {
                const total = data.charts.expense_breakdown.reduce((s, e) => s + e.value, 0)
                const pct = ((slice.value / total) * 100).toFixed(1)
                return (
                  <div key={slice.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gc-text2">{slice.label}</span>
                      <span className="text-gc-text font-medium">{fmt(slice.value)} <span className="text-gc-text3">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-gc-dark3 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: slice.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
