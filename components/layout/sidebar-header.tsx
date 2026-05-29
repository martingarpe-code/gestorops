'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

function SearchTrigger() {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes('MAC'))
  }, [])

  function openPalette() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: !isMac, metaKey: isMac, bubbles: true }))
  }

  return (
    <button
      onClick={openPalette}
      className="flex items-center gap-2 w-full h-8 rounded-md bg-secondary/40 border border-border/60 px-3 text-xs text-muted-foreground hover:border-primary/30 hover:bg-secondary/70 hover:text-foreground transition-all cursor-text"
    >
      <Search className="h-3 w-3 shrink-0" />
      <span className="flex-1 text-left">Buscar...</span>
      <kbd className="text-[10px] bg-background/50 px-1.5 py-0.5 rounded border border-border/60 font-sans leading-tight">
        {isMac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  )
}

export function SidebarHeader() {
  return (
    <div className="flex h-[60px] shrink-0 flex-col border-b border-sidebar-border">
      <div className="flex h-11 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shrink-0 flex items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-white leading-none select-none">G</span>
          </div>
          <span className="text-sm font-bold text-foreground tracking-tight">GestorOps</span>
        </Link>
      </div>
      <div className="px-3 pb-2.5">
        <SearchTrigger />
      </div>
    </div>
  )
}
