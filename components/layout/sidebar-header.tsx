'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

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
      className="flex items-center gap-2 w-full h-7 rounded-md bg-secondary/50 border border-border px-2.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors cursor-text"
    >
      <span className="flex-1 text-left">Buscar...</span>
      <kbd className="text-xs bg-background/60 px-1.5 py-0.5 rounded border border-border font-sans">
        {isMac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  )
}

export function SidebarHeader() {
  return (
    <div className="flex h-14 shrink-0 flex-col border-b border-sidebar-border">
      <div className="flex h-10 items-center px-4 mt-1">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-sm bg-primary shrink-0" />
          <span className="text-sm font-semibold text-foreground tracking-tight">GestorOps</span>
        </Link>
      </div>
      <div className="px-3 pb-2">
        <SearchTrigger />
      </div>
    </div>
  )
}
