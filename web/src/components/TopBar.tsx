'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  const locale = useLocale()
  const otherLocale = locale === 'pt' ? 'en' : 'pt'

  return (
    <header className="bg-gc-dark2 border-b border-gc-border px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <h1 className="text-base font-semibold text-gc-text">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gc-text3">
          {new Date().toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </span>
        <Link
          href="/"
          locale={otherLocale as 'pt' | 'en'}
          className="px-2.5 py-1 text-xs border border-gc-border rounded-md text-gc-text2 hover:text-gc-text hover:bg-gc-dark3 transition-all"
        >
          {otherLocale.toUpperCase()}
        </Link>
      </div>
    </header>
  )
}
