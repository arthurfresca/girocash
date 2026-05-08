'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { TopBar } from '@/components/TopBar'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

interface Workday {
  id: string; date: string; gross_earnings: number; net_profit: number
  km_driven: number; hours_worked: number; fuel_cost: number; ride_count: number
  platform: string; notes: string
}

export default function WorkdaysPage() {
  const t = useTranslations('workdays')
  const tCommon = useTranslations('common')

  const [workdays, setWorkdays] = useState<Workday[]>([])
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [rides, setRides] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [grossEarnings, setGrossEarnings] = useState('')
  const [fuelCost, setFuelCost] = useState('')
  const [startKm, setStartKm] = useState('')
  const [endKm, setEndKm] = useState('')
  const [platform, setPlatform] = useState('Uber')
  const [notes, setNotes] = useState('')

  // auto-calc
  const kmDriven = startKm && endKm ? Math.max(0, Number(endKm) - Number(startKm)) : null
  const hoursWorked = (() => {
    if (!startTime || !endTime) return null
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    const diff = (eh * 60 + em) - (sh * 60 + sm)
    return diff > 0 ? (diff / 60).toFixed(1) : null
  })()
  const estimatedProfit = grossEarnings && fuelCost
    ? Math.max(0, Number(grossEarnings) - Number(fuelCost)) : grossEarnings ? Number(grossEarnings) * 0.75 : null
  const costPerKm = estimatedProfit && kmDriven && kmDriven > 0
    ? (estimatedProfit / kmDriven).toFixed(2) : null

  useEffect(() => {
    fetch(`${BASE}/api/v1/workdays`)
      .then(r => r.json()).then(setWorkdays).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      await fetch(`${BASE}/api/v1/workdays`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date, ride_count: Number(rides), gross_earnings: Number(grossEarnings),
          fuel_cost: Number(fuelCost), km_driven: kmDriven ?? 0,
          hours_worked: Number(hoursWorked ?? 0), platform, notes,
        }),
      })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div>
      <TopBar title={t('title')} />
      <div className="p-6 space-y-6">

        {/* Add form */}
        <section className="bg-gc-dark2 border border-gc-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider mb-4">{t('addSection')}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('date')}</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('rides')}</label>
                <input type="number" value={rides} onChange={e => setRides(e.target.value)}
                  placeholder="ex: 22"
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('startTime')}</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('endTime')}</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('gross')} (R$)</label>
                <input type="number" step="0.01" value={grossEarnings} onChange={e => setGrossEarnings(e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('fuel')} (R$)</label>
                <input type="number" step="0.01" value={fuelCost} onChange={e => setFuelCost(e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('startKm')}</label>
                <input type="number" value={startKm} onChange={e => setStartKm(e.target.value)}
                  placeholder="ex: 45230"
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('endKm')}</label>
                <input type="number" value={endKm} onChange={e => setEndKm(e.target.value)}
                  placeholder="ex: 45417"
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('platform')}</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none">
                  {['Uber', '99', 'InDriver', 'Outro'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-3">
                <label className="block text-xs text-gc-text3 mb-1">{t('notes')}</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder={t('notesPlaceholder')} rows={2}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none resize-none" />
              </div>
            </div>

            {/* Auto-calc row */}
            {(kmDriven !== null || hoursWorked || estimatedProfit || costPerKm) && (
              <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gc-dark3/50 rounded-lg border border-gc-border/50">
                <span className="text-xs text-gc-text3">{t('autoCalc')}:</span>
                {kmDriven !== null && <span className="text-xs text-blue-400">📍 {kmDriven} km</span>}
                {hoursWorked && <span className="text-xs text-purple-400">⏱️ {hoursWorked}h</span>}
                {estimatedProfit && <span className="text-xs text-green-400">💰 {t('estimatedProfit')}: R$ {estimatedProfit.toFixed(2)}</span>}
                {costPerKm && <span className="text-xs text-teal-400">📊 {t('costPerKm')}: R$ {costPerKm}</span>}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button type="submit" disabled={status === 'saving'}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-black font-bold rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
                {status === 'saving' ? t('saving') : t('save')}
              </button>
              {status === 'saved' && <span className="text-sm text-green-400">{t('saved')}</span>}
              {status === 'error' && <span className="text-sm text-red-400">{t('errorSaving')}</span>}
            </div>
          </form>
        </section>

        {/* History */}
        <section>
          <h2 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider mb-3">{t('history')}</h2>
          <div className="bg-gc-dark2 border border-gc-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gc-border">
                  {[t('date'), t('gross'), t('net'), t('km'), t('rides'), t('platform')].map(h => (
                    <th key={h} className={`px-4 py-3 text-gc-text3 font-medium ${h === t('date') || h === t('platform') ? 'text-left' : 'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workdays.map(w => (
                  <tr key={w.id} className="border-b border-gc-border/50 hover:bg-gc-dark3/50 transition-colors">
                    <td className="px-4 py-3 text-gc-text">{w.date}</td>
                    <td className="px-4 py-3 text-right text-green-400 font-medium">{fmt(w.gross_earnings)}</td>
                    <td className="px-4 py-3 text-right text-teal-400">{fmt(w.net_profit)}</td>
                    <td className="px-4 py-3 text-right text-gc-text2">{w.km_driven} km</td>
                    <td className="px-4 py-3 text-right text-gc-text2">{w.ride_count}</td>
                    <td className="px-4 py-3 text-gc-text2">{w.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
