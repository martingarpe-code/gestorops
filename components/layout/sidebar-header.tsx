import Link from 'next/link'

export function SidebarHeader() {
  return (
    <div className="flex h-14 items-center border-b border-sidebar-border px-4">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="h-6 w-6 rounded-sm bg-primary shrink-0" />
        <span className="text-sm font-semibold text-foreground tracking-tight">
          GestorOps
        </span>
      </Link>
    </div>
  )
}
