import Link from 'next/link'

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
        <div className="flex items-center gap-2 w-full h-7 rounded-md bg-secondary/50 border border-border px-2.5 text-xs text-muted-foreground cursor-text select-none">
          <span className="flex-1">Buscar...</span>
          <kbd className="text-xs bg-background/60 px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
        </div>
      </div>
    </div>
  )
}
