'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Wrench,
  AlertCircle,
  KeyRound,
  RefreshCcw,
  FileText,
  Server,
  CheckSquare,
  BarChart2,
  Settings,
} from 'lucide-react'

const navPrimary = [
  { label: 'Dashboard',      href: '/dashboard',       icon: LayoutDashboard },
  { label: 'Clientes',       href: '/clientes',        icon: Users },
  { label: 'Proyectos',      href: '/proyectos',       icon: FolderKanban },
  { label: 'Mantenimientos', href: '/mantenimientos',  icon: Wrench },
  { label: 'Incidencias',    href: '/incidencias',     icon: AlertCircle },
  { label: 'Accesos',        href: '/accesos',         icon: KeyRound },
  { label: 'Renovaciones',   href: '/renovaciones',    icon: RefreshCcw },
]

const navSecondary = [
  { label: 'Documentación',  href: '/documentacion',  icon: FileText },
  { label: 'Infraestructura',href: '/infraestructura', icon: Server },
  { label: 'Tareas',         href: '/tareas',          icon: CheckSquare },
]

const navBottom = [
  { label: 'Analítica',      href: '/analitica',       icon: BarChart2 },
  { label: 'Configuración',  href: '/configuracion',   icon: Settings },
]

function NavItem({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        'text-muted-foreground hover:text-foreground hover:bg-secondary',
        isActive && 'text-foreground bg-secondary'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </Link>
  )
}

function NavSection({
  items,
}: {
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
}) {
  return (
    <div className="px-2 space-y-0.5">
      {items.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </div>
  )
}

export function SidebarNav() {
  return (
    <nav className="flex flex-col gap-1 py-2">
      <NavSection items={navPrimary} />
      <div className="mx-4 my-1 border-t border-sidebar-border" />
      <NavSection items={navSecondary} />
      <div className="mx-4 my-1 border-t border-sidebar-border" />
      <NavSection items={navBottom} />
    </nav>
  )
}
