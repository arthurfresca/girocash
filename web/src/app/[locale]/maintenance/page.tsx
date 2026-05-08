'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { TopBar } from '@/components/TopBar'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

interface MaintenanceEntry {
  id: string; date: string; type: string; description: string
  cost: number; km_at_service: number; next_service_km: number
}

const CATEGORIES = [
  'oleo', 'pneus', 'freios', 'alinhamento', 'balanceamento',
  'lavagem', 'seguro', 'ipva', 'aluguel', 'outros',
]

export default function MaintenancePage() {
  const t = useTranslations('maintenance')

  const [entries, setEntries] = useState<MaintenanceEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const [category, setCategory] = useState('oleo')
  const [cost, setCost] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [kmAtService, setKmAtService] = useState('')
  const [nextServiceDate, setNextServiceDate] = useState('')
  const [nextServiceKm, setNextServiceKm] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetch(`${BASE}/api/v1/maintenance`).then(r => r.json()).then(setEntries).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      await fetch(`${BASE}/api/v1/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date, type: category, description, cost: Number(cost),
          km_at_service: Number(kmAtService), next_service_km: Number(nextServiceKm),
        }),
      })
      setStatus('saved')
      setShowForm(false)
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

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider">{t('title')}</h2>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-black font-bold rounded-lg text-sm hover:opacity-90">
            {showForm ? '✕ Fechar' : `+ ${t('add')}`}
          </button>
        </div>

        {/* Modal-style inline form */}
        {showForm && (
          <section className="bg-gc-dark2 border border-gc-border rounded-xl p-5">
            <h3 className="text-base font-semibold text-gc-text mb-4">{t('addSection')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gc-text3 mb-1">{t('category')}</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none">
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{t(`categories.${c}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gc-text3 mb-1">{t('cost')}</label>
                  <input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)}
                    placeholder={t('costPlaceholder')}
                    className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gc-text3 mb-1">{t('date')}</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gc-text3 mb-1">{t('kmAtService')}</label>
                  <input type="number" value={kmAtService} onChange={e => setKmAtService(e.target.value)}
                    placeholder={t('kmAtServicePlaceholder')}
                    className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gc-text3 mb-1">{t('nextServiceDate')}</label>
                  <input type="date" value={nextServiceDate} onChange={e => setNextServiceDate(e.target.value)}
                    className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gc-text3 mb-1">{t('nextServiceKm')}</label>
                  <input type="number" value={nextServiceKm} onChange={e => setNextServiceKm(e.target.value)}
                    placeholder={t('nextServiceKmPlaceholder')}
                    className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
                </div>
                <div className="col-span-2 md:col-span-3">
                  <label className="block text-xs text-gc-text3 mb-1">{t('description')}</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder={t('descriptionPlaceholder')} rows={2}
                    className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none resize-none" />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <button type="submit" disabled={status === 'saving'}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-black font-bold rounded-lg text-sm hover:opacity-90 disabled:opacity-50">
                  {status === 'saving' ? t('saving') : t('add')}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-gc-border rounded-lg text-sm text-gc-text2 hover:text-gc-text hover:bg-gc-dark3">
                  Cancelar
                </button>
                {status === 'saved' && <span className="text-sm text-green-400">{t('saved')}</span>}
                {status === 'error' && <span className="text-sm text-red-400">{t('errorSaving')}</span>}
              </div>
            </form>
          </section>
        )}

        {/* History */}
        <div className="bg-gc-dark2 border border-gc-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gc-border">
                <th className="text-left px-4 py-3 text-gc-text3 font-medium">{t('date')}</th>
                <th className="text-left px-4 py-3 text-gc-text3 font-medium">{t('type')}</th>
                <th className="text-left px-4 py-3 text-gc-text3 font-medium">{t('description')}</th>
                <th className="text-right px-4 py-3 text-gc-text3 font-medium">{t('cost')}</th>
                <th className="text-right px-4 py-3 text-gc-text3 font-medium">{t('kmAtService')}</th>
                <th className="text-right px-4 py-3 text-gc-text3 font-medium">{t('nextServiceKm')}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} className="border-b border-gc-border/50 hover:bg-gc-dark3/50">
                  <td className="px-4 py-3 text-gc-text">{e.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-400">{e.type}</span>
                  </td>
                  <td className="px-4 py-3 text-gc-text2">{e.description}</td>
                  <td className="px-4 py-3 text-right font-medium text-yellow-400">{fmt(e.cost)}</td>
                  <td className="px-4 py-3 text-right text-gc-text2">{e.km_at_service.toLocaleString()} km</td>
                  <td className="px-4 py-3 text-right text-gc-text2">{e.next_service_km.toLocaleString()} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
