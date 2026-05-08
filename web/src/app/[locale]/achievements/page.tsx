'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { TopBar } from '@/components/TopBar'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Achievement {
  id: string; title: string; description: string; icon: string
  unlocked: boolean; unlocked_at?: string; xp: number
}
interface Profile {
  level: number; xp: number; streak: number
}

export default function AchievementsPage() {
  const t = useTranslations('achievements')

  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetch(`${BASE}/api/v1/achievements`).then(r => r.json()).then(setAchievements).catch(() => {})
    fetch(`${BASE}/api/v1/profile`).then(r => r.json()).then(setProfile).catch(() => {})
  }, [])

  const xpForNextLevel = profile ? profile.level * 500 : 1500
  const xpPct = profile ? Math.min((profile.xp / xpForNextLevel) * 100, 100) : 0
  const xpToNext = profile ? xpForNextLevel - profile.xp : 0

  return (
    <div>
      <TopBar title={t('title')} />
      <div className="p-6 space-y-6">

        {/* Streak + Level cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gc-dark2 border border-gc-border rounded-xl p-5 flex items-center gap-4">
            <div className="text-5xl">🔥</div>
            <div>
              <p className="text-4xl font-bold text-orange-400">{profile?.streak ?? 12}</p>
              <p className="text-sm font-semibold text-gc-text mt-1">{t('streak')} {t('days')}</p>
              <p className="text-xs text-gc-text3 mt-1">{t('streakDesc')}</p>
            </div>
          </div>

          <div className="bg-gc-dark2 border border-gc-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-lg">
                🚀
              </div>
              <div>
                <p className="text-sm font-semibold text-gc-text">{t('level')} {profile?.level ?? 8}</p>
                <p className="text-xs text-gc-text3">Motorista Profissional</p>
              </div>
            </div>
            <div className="w-full bg-gc-dark3 rounded-full h-2.5 mb-2">
              <div className="h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${xpPct}%` }} />
            </div>
            <p className="text-xs text-gc-text3">{profile?.xp ?? 0} XP — {t('nextLevel')} {xpToNext} XP</p>
          </div>
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {achievements.map(a => (
            <div
              key={a.id}
              className={`bg-gc-dark2 border rounded-xl p-4 transition-all
                ${a.unlocked ? 'border-green-500/30 hover:-translate-y-0.5' : 'border-gc-border opacity-50'}`}
            >
              <div className="text-3xl mb-3">{a.icon}</div>
              <h3 className={`font-semibold text-sm ${a.unlocked ? 'text-gc-text' : 'text-gc-text3'}`}>{a.title}</h3>
              <p className="text-xs text-gc-text3 mt-1">{a.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                  ${a.unlocked ? 'bg-green-500/10 text-green-400' : 'bg-gc-dark3 text-gc-text3'}`}>
                  {a.unlocked ? t('unlocked') : t('locked')}
                </span>
                <span className="text-xs text-yellow-400">+{a.xp} {t('xp')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
