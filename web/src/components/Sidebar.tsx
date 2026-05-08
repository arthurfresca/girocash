'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'

const navGroups = [
  {
    labelKey: 'principal',
    items: [
      { key: 'dashboard', icon: '📊', href: '/' },
      { key: 'workdays', icon: '📅', href: '/workdays' },
      { key: 'fuel', icon: '⛽', href: '/fuel' },
      { key: 'maintenance', icon: '🔧', href: '/maintenance' },
    ],
  },
  {
    labelKey: 'financeiro',
    items: [
      { key: 'finances', icon: '📈', href: '/finances' },
      { key: 'goals', icon: '🎯', href: '/goals' },
    ],
  },
  {
    labelKey: 'extras',
    items: [
      { key: 'copilot', icon: '🤖', href: '/copilot', badge: 'IA' },
      { key: 'achievements', icon: '🏆', href: '/achievements' },
      { key: 'profile', icon: '👤', href: '/profile' },
    ],
  },
] as const

export function Sidebar() {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
    <aside className="w-[220px] bg-gc-dark2 border-r border-gc-border flex flex-col fixed top-0 left-0 h-screen z-50">
      <div className="px-4 py-5 border-b border-gc-border flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-lg">
          💸
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          GiroCash
        </span>
      </div>

      <nav className="flex-1 p-2 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.labelKey} className="mb-3">
            <p className="text-[10px] font-semibold text-gc-text3 uppercase tracking-wider px-2 py-1.5">
              {t(group.labelKey)}
            </p>
            {group.items.map((item) => {
              const { key, icon, href } = item
              const badge = 'badge' in item ? item.badge : undefined
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
              return (
                <Link
                  key={key}
                  href={href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm mb-0.5 transition-all
                    ${isActive
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'text-gc-text2 hover:bg-gc-dark3 hover:text-gc-text'
                    }`}
                >
                  <span className="text-base w-5 text-center">{icon}</span>
                  <span className="flex-1">{t(key)}</span>
                  {badge && (
                    <span className="text-[10px] font-bold bg-green-500 text-black px-1.5 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-gc-border">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gc-dark3 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-black">
            CS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gc-text truncate">Carlos Silva</p>
            <p className="text-xs text-green-400">Pro</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
