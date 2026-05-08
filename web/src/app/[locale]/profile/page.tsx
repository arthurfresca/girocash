'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { TopBar } from '@/components/TopBar'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

function fmt(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

interface UserProfile {
  id: string; name: string; email: string; plan: string
  level: number; xp: number; streak: number; platform: string; vehicle: string
}

const PLANS = [
  { key: 'free', label: 'Grátis', price: 'R$ 0', desc: 'Registros básicos' },
  { key: 'pro', label: 'Pro ⚡', price: 'R$ 19,90', desc: 'Relatórios + IA + Gamificação', current: true },
  { key: 'premium', label: 'Premium 💎', price: 'R$ 39,90', desc: 'Exportação + Alertas avançados' },
]

export default function ProfilePage() {
  const t = useTranslations('profile')

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [monthlyGoal, setMonthlyGoal] = useState('')
  const [avgConsumption, setAvgConsumption] = useState('')

  useEffect(() => {
    fetch(`${BASE}/api/v1/profile`).then(r => r.json()).then((p: UserProfile) => {
      setProfile(p)
      setName(p.name)
      setEmail(p.email)
      setVehicle(p.vehicle)
    }).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      await fetch(`${BASE}/api/v1/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, city, vehicle, monthly_goal: Number(monthlyGoal), avg_consumption: Number(avgConsumption) }),
      })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const xpForNextLevel = profile ? profile.level * 500 : 1500
  const xpPct = profile ? Math.min((profile.xp / xpForNextLevel) * 100, 100) : 0
  const initials = (profile?.name ?? 'CS').split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div>
      <TopBar title={t('title')} />
      <div className="p-6 space-y-6 max-w-3xl">

        {/* Profile header */}
        <div className="bg-gc-dark2 border border-gc-border rounded-xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-black">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gc-text">{profile?.name ?? '—'}</h2>
              <p className="text-gc-text2 text-sm">{profile?.vehicle ?? '—'}</p>
              <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 font-medium mt-1 inline-block">
                Plano {profile?.plan ?? '—'} ⚡ Ativo
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="text-center p-3 bg-gc-dark3 rounded-lg">
              <p className="text-2xl font-bold text-gc-text">28</p>
              <p className="text-xs text-gc-text3 mt-1">{t('daysRegistered')}</p>
            </div>
            <div className="text-center p-3 bg-gc-dark3 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">{profile?.xp ?? 0}</p>
              <p className="text-xs text-gc-text3 mt-1">{t('xp')}</p>
            </div>
            <div className="text-center p-3 bg-gc-dark3 rounded-lg">
              <p className="text-2xl font-bold text-orange-400">🔥 {profile?.streak ?? 0}</p>
              <p className="text-xs text-gc-text3 mt-1">{t('streak')} {t('days')}</p>
            </div>
          </div>

          {/* XP bar */}
          <div className="flex justify-between text-xs text-gc-text3 mb-1">
            <span>Nível {profile?.level ?? '—'} — {profile?.xp ?? 0} XP</span>
            <span>Próximo: {xpForNextLevel} XP</span>
          </div>
          <div className="w-full bg-gc-dark3 rounded-full h-2">
            <div className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-gc-dark2 border border-gc-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider mb-4">{t('editProfile')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {[
                { label: t('name'), value: name, set: setName, placeholder: t('namePlaceholder'), type: 'text' },
                { label: t('email'), value: email, set: setEmail, placeholder: t('emailPlaceholder'), type: 'email' },
                { label: t('city'), value: city, set: setCity, placeholder: t('cityPlaceholder'), type: 'text' },
                { label: t('vehicle'), value: vehicle, set: setVehicle, placeholder: t('vehiclePlaceholder'), type: 'text' },
                { label: t('monthlyGoal'), value: monthlyGoal, set: setMonthlyGoal, placeholder: t('monthlyGoalPlaceholder'), type: 'number' },
                { label: t('avgConsumption'), value: avgConsumption, set: setAvgConsumption, placeholder: t('avgConsumptionPlaceholder'), type: 'number' },
              ].map(({ label, value, set, placeholder, type }) => (
                <div key={label}>
                  <label className="block text-xs text-gc-text3 mb-1">{label}</label>
                  <input type={type} value={value} onChange={e => set(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-gc-dark3 border border-gc-border rounded-lg px-3 py-2 text-sm text-gc-text focus:border-green-500 outline-none" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <button type="submit" disabled={status === 'saving'}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-black font-bold rounded-lg text-sm hover:opacity-90 disabled:opacity-50">
                {status === 'saving' ? t('saving') : t('saveProfile')}
              </button>
              <button type="button"
                className="px-4 py-2.5 border border-red-500/30 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
                {t('logout')}
              </button>
              {status === 'saved' && <span className="text-sm text-green-400">{t('saved')}</span>}
              {status === 'error' && <span className="text-sm text-red-400">{t('errorSaving')}</span>}
            </div>
          </form>
        </div>

        {/* Plans */}
        <div className="bg-gc-dark2 border border-gc-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gc-text3 uppercase tracking-wider mb-4">{t('plans')}</h3>
          <div className="grid grid-cols-3 gap-3">
            {PLANS.map(plan => (
              <div key={plan.key}
                className={`rounded-xl p-4 border text-center transition-all
                  ${plan.current
                    ? 'border-green-500/40 bg-green-500/5'
                    : 'border-gc-border hover:border-gc-text3 cursor-pointer'
                  }`}
              >
                <p className="font-bold text-gc-text">{plan.label}</p>
                <p className="text-2xl font-bold text-gc-text my-2">{plan.price}</p>
                <p className="text-xs text-gc-text3">{plan.desc}</p>
                {plan.current && (
                  <span className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
                    {t('currentPlan')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
