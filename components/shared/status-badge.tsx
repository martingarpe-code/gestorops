import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; className: string }> = {
  // Client
  active:         { label: 'Activo',      className: 'bg-green-500/15 text-green-400 border-green-500/20' },
  inactive:       { label: 'Inactivo',    className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
  prospect:       { label: 'Prospecto',   className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  // Project
  proposal:       { label: 'Propuesta',   className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  paused:         { label: 'Pausado',     className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  completed:      { label: 'Completado',  className: 'bg-green-500/15 text-green-400 border-green-500/20' },
  cancelled:      { label: 'Cancelado',   className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  // Incident
  open:           { label: 'Abierta',     className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  in_progress:    { label: 'En curso',    className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  waiting_client: { label: 'Esperando',   className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  resolved:       { label: 'Resuelta',    className: 'bg-green-500/15 text-green-400 border-green-500/20' },
  closed:         { label: 'Cerrada',     className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
  // Maintenance
  pending:        { label: 'Pendiente',   className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  invoiced:       { label: 'Facturado',   className: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
  // Renewal
  expired:        { label: 'Vencido',     className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  // Access
  unknown:        { label: 'Desconocido', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
  // Task
  todo:           { label: 'Pendiente',   className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
  done:           { label: 'Hecho',       className: 'bg-green-500/15 text-green-400 border-green-500/20' },
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  critical: { label: 'Crítica',  className: 'bg-red-500/15 text-red-400 border-red-500/20' },
  high:     { label: 'Alta',     className: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  medium:   { label: 'Media',    className: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  low:      { label: 'Baja',     className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' },
}

export function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20' }
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', cfg.className)}>
      {cfg.label}
    </Badge>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  const cfg = priorityConfig[priority] ?? { label: priority, className: 'bg-zinc-500/15 text-zinc-400' }
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', cfg.className)}>
      {cfg.label}
    </Badge>
  )
}
