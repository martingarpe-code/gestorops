import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import Link from 'next/link'
import { Users, FolderKanban, AlertCircle, KeyRound, FileText, Wrench } from 'lucide-react'

export const metadata = { title: 'Historial Técnico' }

const entityConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; href: (id: string) => string }> = {
  client:    { label: 'Cliente',     icon: Users,         color: 'text-blue-400',   href: (id) => `/clientes/${id}` },
  project:   { label: 'Proyecto',    icon: FolderKanban,  color: 'text-purple-400', href: (id) => `/proyectos/${id}` },
  incident:  { label: 'Incidencia',  icon: AlertCircle,   color: 'text-red-400',    href: (id) => `/incidencias/${id}` },
  access:    { label: 'Acceso',      icon: KeyRound,      color: 'text-amber-400',  href: (id) => `/accesos/${id}` },
  document:  { label: 'Documento',   icon: FileText,      color: 'text-green-400',  href: (id) => `/documentacion/${id}` },
  maintenance:{ label: 'Mantenimiento', icon: Wrench,     color: 'text-zinc-400',   href: (id) => `/mantenimientos/${id}` },
}

const actionLabels: Record<string, string> = {
  created: 'creado', updated: 'actualizado', deleted: 'eliminado',
  viewed: 'visualizado', copied: 'copiado', edited: 'editado',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `hace ${days}d`
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

export default async function HistorialPage() {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  // Group by date
  const grouped = new Map<string, typeof logs>()
  logs?.forEach(log => {
    const date = new Date(log.created_at).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    if (!grouped.has(date)) grouped.set(date, [])
    grouped.get(date)!.push(log)
  })

  return (
    <>
      <PageHeader title="Historial Técnico" description={`${logs?.length ?? 0} eventos registrados`} />

      {!logs?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">Sin actividad registrada todavía.</p>
          <p className="text-xs text-muted-foreground mt-1">El historial se genera automáticamente al crear o modificar registros.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([date, entries]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 capitalize">{date}</h3>
              <div className="space-y-1">
                {entries?.map(log => {
                  const cfg = entityConfig[log.entity_type]
                  const Icon = cfg?.icon
                  const href = cfg && log.entity_id ? cfg.href(log.entity_id) : null

                  return (
                    <div key={log.id} className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-secondary/30 transition-colors group">
                      <div className={`mt-0.5 shrink-0 ${cfg?.color ?? 'text-muted-foreground'}`}>
                        {Icon ? <Icon className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full bg-secondary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          {log.description ?? (
                            <>{cfg?.label ?? log.entity_type} <span className="text-muted-foreground">{actionLabels[log.action] ?? log.action}</span></>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground capitalize">{cfg?.label ?? log.entity_type}</span>
                          {href && (
                            <Link href={href} className="text-xs text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                              Ver →
                            </Link>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{timeAgo(log.created_at)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
