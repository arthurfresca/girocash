'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { TopBar } from '@/components/TopBar'
import { StatCard } from '@/components/StatCard'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

interface DashboardData {
  today: { gross_earnings: number; net_profit: number; fuel_cost: number; km_driven: number }
  charts: {
    daily_earnings: { label: string; gross: number; net: number }[]
    expense_breakdown: { label: string; value: number; color: string }[]
  }
}

const TABS = ['today', 'week', 'month'] as const
type Tab = typeof TABS[number]

export default function FinancesPage() {
  const t = useTranslations('finances')

  const [tab, setTab] = useState<Tab>('today')
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch(`${BASE}/api/v1/dashboard`).then(r => r.json()).then(setData).catch(() => {})
  }, [])

  const grossRevenue = data?.today.gross_earnings ?? 0
  const fuelCost = data?.today.fuel_cost ?? 0
  const fixedCosts = 48
  const variableCosts = fuelCost
  const netProfit = grossRevenue - fixedCosts - variableCosts

  return (
    <div>
      <TopBar title={t('title')} />
      <div className="p-6 space-y-6">

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${tab === tabKey
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'border border-gc-border text-gc-text2 hover:bg-gc-dark3 hover:text-gc-text'
                } ${tabKey !== 'today' ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={tabKey !== 'today'}
              title={tabKey !== 'today' ? t('comingSoon') : ''}
            >
              {t(tabKey)} {tabKey !== 'today' && <span className="text-[10px] ml-1 text-gc-text3">{t('comingSoon')}</span>}
            </button>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label={t('grossRevenue')} value={fmt(grossRevenue)} icon="📈" color="green" />
          <StatCard label={t('fixedCosts')} value={fmt(fixedCosts)} icon="📋" color="warn" />
          <StatCard label={t('variableCosts')} value={fmt(variableCosts)} icon="⚠️" color="danger" />
          <StatCard label={t('netProfit')} value={fmt(Math.max(0, netProfit))} icon="💰" color="teal" />
        </div>

        {/* Bar chart */}
        <section className="bg-gc-dark2 border border-gc-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gc-text">{t('chartTitle')} — Maio 2026</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs border border-gc-border rounded-lg text-gc-text2 hover:bg-gc-dark3 transition-all">
                {t('exportCSV')}
              </button>
              <button className="px-3 py-1.5 text-xs border border-gc-border rounded-lg text-gc-text2 hover:bg-gc-dark3 transition-all">
                {t('exportPDF')}
              </button>
            </div>
          </div>

          {data ? (
            <>
              <div className="flex items-end gap-3 h-48 overflow-x-auto pb-2">
                {data.charts.daily_earnings.map(point => {
                  const maxVal = Math.max(...data.charts.daily_earnings.map(p => p.gross || 0), 1)
                  const expenses = point.gross * 0.25
                  return (
                    <div key={point.label} className="flex-1 min-w-[40px] flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center gap-0.5 h-40">
                        <div className="flex-1 bg-green-500/40 rounded-t hover:bg-green-500/60 transition-colors"
                          style={{ height: `${(point.gross / maxVal) * 100}%` }}
                          title={`${t('revenue')}: ${fmt(point.gross)}`} />
                        <div className="flex-1 bg-red-500/40 rounded-t hover:bg-red-500/60 transition-colors"
                          style={{ height: `${(expenses / maxVal) * 100}%` }}
                          title={`${t('expenses')}: ${fmt(expenses)}`} />
                        <div className="flex-1 bg-blue-500/40 rounded-t hover:bg-blue-500/60 transition-colors"
                          style={{ height: `${(point.net / maxVal) * 100}%` }}
                          title={`${t('profit')}: ${fmt(point.net)}`} />
                      </div>
                      <span className="text-xs text-gc-text3">{point.label}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-gc-border/50">
                {[
                  { label: t('revenue'), color: 'bg-green-500/40' },
                  { label: t('expenses'), color: 'bg-red-500/40' },
                  { label: t('profit'), color: 'bg-blue-500/40' },
                ].map(({ label, color }) => (
                  <span key={label} className="flex items-center gap-1.5 text-xs text-gc-text3">
                    <span className={`w-3 h-3 rounded-sm inline-block ${color}`} />
                    {label}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-gc-text3 text-sm">
              Carregando...
            </div>
          )}
        </section>

        {/* Expense breakdown */}
        {data && (
          <section className="bg-gc-dark2 border border-gc-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gc-text mb-4">Distribuição de Despesas</h2>
            <div className="space-y-3">
              {data.charts.expense_breakdown.map(slice => {
                const total = data.charts.expense_breakdown.reduce((s, e) => s + e.value, 0)
                const pct = ((slice.value / total) * 100).toFixed(1)
                return (
                  <div key={slice.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gc-text2">{slice.label}</span>
                      <span className="text-gc-text font-medium">{fmt(slice.value)} <span className="text-gc-text3">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-gc-dark3 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: slice.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
