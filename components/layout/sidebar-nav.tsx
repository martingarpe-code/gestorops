'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, FolderKanban, Wrench, AlertCircle,
  KeyRound, RefreshCcw, FileText, Server, CheckSquare, BarChart2, Settings, Clock, Bot,
} from 'lucide-react'

export type NavCounts = {
  incidents?: number
  renewals?: number
  maintenances?: number
  tasks?: number
}

const navPrimary = [
  { label: 'Dashboard',      href: '/dashboard',       icon: LayoutDashboard, countKey: undefined },
  { label: 'Asistente IA',   href: '/ia',              icon: Bot,             countKey: undefined },
  { label: 'Clientes',       href: '/clientes',        icon: Users,           countKey: undefined },
  { label: 'Proyectos',      href: '/proyectos',       icon: FolderKanban,    countKey: undefined },
  { label: 'Mantenimientos', href: '/mantenimientos',  icon: Wrench,          countKey: 'maintenances' as const },
  { label: 'Incidencias',    href: '/incidencias',     icon: AlertCircle,     countKey: 'incidents' as const },
  { label: 'Accesos',        href: '/accesos',         icon: KeyRound,        countKey: undefined },
  { label: 'Renovaciones',   href: '/renovaciones',    icon: RefreshCcw,      countKey: 'renewals' as const },
]

const navSecondary = [
  { label: 'Documentación',   href: '/documentacion',  icon: FileText,     countKey: undefined },
  { label: 'Infraestructura', href: '/infraestructura', icon: Server,       countKey: undefined },
  { label: 'Tareas',          href: '/tareas',          icon: CheckSquare,  countKey: 'tasks' as const },
  { label: 'Historial',       href: '/historial',       icon: Clock,        countKey: undefined },
]

const navBottom = [
  { label: 'Analítica',      href: '/analitica',      icon: BarChart2, countKey: undefined },
  { label: 'Configuración',  href: '/configuracion',  icon: Settings,  countKey: undefined },
]

function NavItem({ href, label, icon: Icon, badge }: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link href={href} className={cn(
      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      'text-muted-foreground hover:text-foreground hover:bg-secondary',
      isActive && 'text-foreground bg-secondary'
    )}>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full tabular-nums">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

function NavSection({ items, counts }: {
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; countKey: keyof NavCounts | undefined }[]
  counts: NavCounts
}) {
  return (
    <div className="px-2 space-y-0.5">
      {items.map(item => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          badge={item.countKey ? counts[item.countKey] : undefined}
        />
      ))}
    </div>
  )
}

export function SidebarNav({ counts = {} }: { counts?: NavCounts }) {
  return (
    <nav className="flex flex-col gap-1 py-2">
      <NavSection items={navPrimary} counts={counts} />
      <div className="mx-4 my-1 border-t border-sidebar-border" />
      <NavSection items={navSecondary} counts={counts} />
      <div className="mx-4 my-1 border-t border-sidebar-border" />
      <NavSection items={navBottom} counts={counts} />
    </nav>
  )
}
