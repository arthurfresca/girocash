'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { TopBar } from '@/components/TopBar'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

const FUEL_TYPES = [
  { key: 'Gasolina', icon: '⛽' },
  { key: 'Etanol', icon: '🌿' },
  { key: 'GNV', icon: '💨' },
  { key: 'Diesel', icon: '🔵' },
  { key: 'Elétrico', icon: '⚡' },
]

interface FuelEntry {
  id: string; date: string; fuel_type: string; liters: number
  total_cost: number; price_per_liter: number; km_at_fill: number; station: string
}

export default function FuelPage() {
  const t = useTranslations('fuel')
  const tCommon = useTranslations('common')

  const [entries, setEntries] = useState<FuelEntry[]>([])
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const [fuelType, setFuelType] = useState('Gasolina')
  const [liters, setLiters] = useState('')
  const [pricePerLiter, setPricePerLiter] = useState('')
  const [kmAtFill, setKmAtFill] = useState('')
  const [station, setStation] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const total = liters && pricePerLiter ? (Number(liters) * Number(pricePerLiter)) : null

  useEffect(() => {
    fetch(`${BASE}/api/v1/fuel`).then(r => r.json()).then(setEntries).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      await fetch(`${BASE}/api/v1/fuel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date, fuel_type: fuelType, liters: Number(liters),
          price_per_liter: Number(pricePerLiter), total_cost: total ?? 0,
          km_at_fill: Number(kmAtFill), station,
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

            {/* Fuel type selector */}
            <div className="mb-4">
              <label className="block text-xs text-gc-text3 mb-2">{t('type')}</label>
              <div className="flex flex-wrap gap-2">
                {FUEL_TYPES.map(({ key, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFuelType(key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all
                      ${fuelType === key
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-gc-dark3 border-gc-border text-gc-text2 hover:text-gc-text'
                      }`}
                  >
                    <span>{icon}</span> {t(`types.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('date')}</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('liters')}</label>
                <input type="number" step="0.1" value={liters} onChange={e => setLiters(e.target.value)}
                  placeholder={t('litersPlaceholder')}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('pricePerLiter')}</label>
                <input type="number" step="0.01" value={pricePerLiter} onChange={e => setPricePerLiter(e.target.value)}
                  placeholder={t('pricePerLiterPlaceholder')}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gc-text3 mb-1">{t('kmAtFill')}</label>
                <input type="number" value={kmAtFill} onChange={e => setKmAtFill(e.target.value)}
                  placeholder={t('kmAtFillPlaceholder')}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gc-text3 mb-1">{t('station')}</label>
                <input type="text" value={station} onChange={e => setStation(e.target.value)}
                  placeholder={t('stationPlaceholder')}
                  className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
              </div>
            </div>

            {/* Auto-calc */}
            {total !== null && (
              <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gc-dark3/50 rounded-lg border border-gc-border/50">
                <span className="text-xs text-gc-text3">Calculado:</span>
                <span className="text-xs text-yellow-400">💰 {t('total')}: {fmt(total)}</span>
                {liters && kmAtFill && <span className="text-xs text-gc-text3">📍 {t('kmAtFill')}: {Number(kmAtFill).toLocaleString()} km</span>}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button type="submit" disabled={status === 'saving'}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-black font-bold rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
                {status === 'saving' ? t('saving') : t('add')}
              </button>
              {status === 'saved' && <span className="text-sm text-green-400">{t('saved')}</span>}
              {status === 'error' && <span className="text-sm text-red-400">{t('errorSaving')}</span>}
            </div>
          </form>
        </section>

        {/* History */}
        <section>
          <div className="bg-gc-dark2 border border-gc-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gc-border">
                  <th className="text-left px-4 py-3 text-gc-text3 font-medium">{t('date')}</th>
                  <th className="text-left px-4 py-3 text-gc-text3 font-medium">{t('type')}</th>
                  <th className="text-right px-4 py-3 text-gc-text3 font-medium">{t('liters')}</th>
                  <th className="text-right px-4 py-3 text-gc-text3 font-medium">{t('pricePerLiter')}</th>
                  <th className="text-right px-4 py-3 text-gc-text3 font-medium">{t('total')}</th>
                  <th className="text-left px-4 py-3 text-gc-text3 font-medium">{t('station')}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id} className="border-b border-gc-border/50 hover:bg-gc-dark3/50">
                    <td className="px-4 py-3 text-gc-text">{e.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400">{e.fuel_type}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gc-text2">{e.liters}L</td>
                    <td className="px-4 py-3 text-right text-gc-text2">{fmt(e.price_per_liter)}</td>
                    <td className="px-4 py-3 text-right font-medium text-yellow-400">{fmt(e.total_cost)}</td>
                    <td className="px-4 py-3 text-gc-text2">{e.station}</td>
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
