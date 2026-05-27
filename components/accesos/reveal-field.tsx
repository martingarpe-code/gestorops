'use client'

import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { revealFieldAction } from '@/app/(dashboard)/accesos/actions'

export function RevealField({ id, field, label, isPassword }: {
  id: string
  field: 'username' | 'password' | 'notes'
  label: string
  isPassword?: boolean
}) {
  const [value, setValue] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)

  async function reveal() {
    if (value !== null) { setVisible(v => !v); return }
    setLoading(true)
    const plain = await revealFieldAction(id, field)
    setValue(plain || '—')
    setVisible(true)
    setLoading(false)
  }

  async function copy() {
    if (!value || value === '—') return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 min-w-0">
        {value === null ? (
          <span className="text-sm text-muted-foreground">••••••••</span>
        ) : (
          <span className={`text-sm font-mono text-foreground break-all ${isPassword && !visible ? 'blur-sm select-none' : ''}`}>
            {value}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={reveal} disabled={loading}>
          {loading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" /> : visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
        {value && value !== '—' && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        )}
      </div>
    </div>
  )
}
