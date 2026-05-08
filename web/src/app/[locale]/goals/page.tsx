import { getTranslations } from 'next-intl/server'
import { TopBar } from '@/components/TopBar'
import { api } from '@/lib/api'
import type { Goal } from '@/lib/types'

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

function formatValue(value: number, type: string) {
  if (type === 'earnings' || type === 'fuel') return fmt(value)
  if (type === 'km') return `${value} km`
  return `${value}`
}

export default async function GoalsPage() {
  const t = await getTranslations('goals')

  let goals: Goal[] = []
  try {
    goals = await api.getGoals()
  } catch {
    // handled below
  }

  return (
    <div>
      <TopBar title={t('title')} />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const pct = Math.min((g.current_value / g.target_value) * 100, 100)
            const done = pct >= 100
            return (
              <div key={g.id} className="bg-gc-dark2 border border-gc-border rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gc-text">{g.title}</h3>
                    <p className="text-xs text-gc-text3 mt-0.5">{t('deadline')}: {g.deadline}</p>
                  </div>
                  {done ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400">{t('completed')}</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400">{t('inProgress')}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gc-text3">{t('current')}: <span className="text-gc-text font-medium">{formatValue(g.current_value, g.type)}</span></span>
                  <span className="text-gc-text3">{t('target')}: <span className="text-gc-text font-medium">{formatValue(g.target_value, g.type)}</span></span>
                </div>
                <div className="w-full bg-gc-dark3 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${done ? 'bg-green-400' : 'bg-blue-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-right text-xs text-gc-text3 mt-1">{pct.toFixed(1)}%</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
