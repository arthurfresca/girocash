'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { TopBar } from '@/components/TopBar'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Message {
  role: 'bot' | 'user'
  text: string
  ts: number
}

const QUICK_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const

export default function CopilotPage() {
  const t = useTranslations('copilot')

  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: t('greeting'), ts: Date.now() },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', text: text.trim(), ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${BASE}/api/v1/copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || data.message, ts: Date.now() }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: t('errorMessage'), ts: Date.now() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar title={t('title')} />

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full p-6 gap-4 overflow-hidden">

        {/* Chat header */}
        <div className="bg-gc-dark2 border border-gc-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <h2 className="font-semibold text-gc-text">{t('subtitle')}</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              {t('status')}
            </p>
          </div>
        </div>

        {/* Quick questions */}
        <div>
          <p className="text-xs text-gc-text3 mb-2">{t('quickQuestions')}</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_KEYS.map(key => (
              <button
                key={key}
                onClick={() => sendMessage(t(key))}
                disabled={loading}
                className="px-3 py-1.5 text-xs border border-gc-border rounded-full text-gc-text2 hover:text-gc-text hover:bg-gc-dark3 hover:border-green-500/40 transition-all disabled:opacity-50"
              >
                {t(key)}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map(msg => (
            <div
              key={msg.ts}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-green-500/30 to-blue-500/30 border border-green-500/20 text-gc-text ml-8'
                    : 'bg-gc-dark2 border border-gc-border text-gc-text2 mr-8'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gc-dark2 border border-gc-border rounded-2xl px-4 py-3 text-sm text-gc-text3 mr-8">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder={t('inputPlaceholder')}
            disabled={loading}
            className="flex-1 bg-gc-dark2 border border-gc-border rounded-xl px-4 py-3 text-sm text-gc-text placeholder-gc-text3 focus:border-green-500 outline-none disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-black font-bold rounded-xl text-sm hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {t('send')}
          </button>
        </div>
      </div>
    </div>
  )
}
