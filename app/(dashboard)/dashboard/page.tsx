import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge'
import { Users, FolderKanban, Wrench, AlertCircle, RefreshCcw, KeyRound } from 'lucide-react'

export const metadata = { title: 'Dashboard' }

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function StatCard({ icon: Icon, label, value, sub, href, accent }: {
  icon: React.ComponentType<{ className?: string }>
  label: string; value: number | string; sub?: string; href: string; accent?: string
}) {
  return (
    <Link href={href} className="group rounded-lg border border-border bg-card p-4 hover:border-primary/30 hover:bg-card/80 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`rounded-md p-2 ${accent ?? 'bg-secondary'}`}>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className={`text-2xl font-semibold tabular-nums mb-0.5 ${accent ? 'text-red-400' : 'text-foreground'}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </Link>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const currentPeriod = (() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })()

  const [
    { count: clientCount },
    { count: projectCount },
    { data: incidents },
    { data: renewals },
    { data: maintenances },
    { data: entries },
    { count: accessCount },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('type', 'active'),
    supabase.from('projects').select('*', { count: 'exact', head: true }).in('status', ['active', 'proposal']),
    supabase.from('incidents').select('id,title,status,priority,client_id,opened_at,clients(name)').in('status', ['open', 'in_progress']).order('priority').order('opened_at'),
    supabase.from('renewals').select('id,name,renewal_date,status,client_id,clients(name)').eq('status', 'active').order('renewal_date').limit(8),
    supabase.from('maintenances').select('id,name,client_id,clients(name)').eq('status', 'active'),
    supabase.from('maintenance_entries').select('maintenance_id,status').eq('period', currentPeriod),
    supabase.from('technical_accesses').select('*', { count: 'exact', head: true }),
  ])

  const entryMap = new Map(entries?.map(e => [e.maintenance_id, e.status]) ?? [])
  const pendingMaint = maintenances?.filter(m => !entryMap.has(m.id) || entryMap.get(m.id) === 'pending').length ?? 0
  const expiring30 = renewals?.filter(r => daysUntil(r.renewal_date) <= 30).length ?? 0
  const criticalIncidents = incidents?.filter(i => i.priority === 'critical').length ?? 0

  return (
    <>
      <PageHeader title="Dashboard" description={new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard icon={Users}        label="Clientes activos"    value={clientCount ?? 0}                href="/clientes" />
        <StatCard icon={FolderKanban} label="Proyectos activos"   value={projectCount ?? 0}               href="/proyectos" />
        <StatCard icon={AlertCircle}  label="Incidencias abiertas" value={incidents?.length ?? 0}
          sub={criticalIncidents > 0 ? `${criticalIncidents} críticas` : undefined}
          href="/incidencias" accent={criticalIncidents > 0 ? 'bg-red-500/15' : undefined} />
        <StatCard icon={Wrench}       label="Mant. pendientes"    value={pendingMaint}
          sub="este mes" href="/mantenimientos" accent={pendingMaint > 0 ? 'bg-amber-500/15' : undefined} />
        <StatCard icon={RefreshCcw}   label="Renov. próximas"     value={expiring30}
          sub="en 30 días" href="/renovaciones" accent={expiring30 > 0 ? 'bg-amber-500/15' : undefined} />
        <StatCard icon={KeyRound}     label="Accesos guardados"   value={accessCount ?? 0}                href="/accesos" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open incidents */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />Incidencias abiertas
            </h2>
            <Link href="/incidencias/nuevo" className="text-xs text-primary hover:underline">+ Nueva</Link>
          </div>
          {!incidents?.length ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Sin incidencias abiertas</p>
          ) : (
            <div className="space-y-1">
              {incidents.slice(0, 6).map(inc => (
                <Link key={inc.id} href={`/incidencias/${inc.id}`} className="flex items-center justify-between py-2 px-2 rounded hover:bg-secondary/50 transition-colors group">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground group-hover:text-primary truncate">{inc.title}</p>
                    <p className="text-xs text-muted-foreground">{(inc.clients as unknown as { name: string } | null)?.name}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <PriorityBadge priority={inc.priority} />
                    <StatusBadge status={inc.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming renewals */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-amber-400" />Próximas renovaciones
            </h2>
            <Link href="/renovaciones/nuevo" className="text-xs text-primary hover:underline">+ Nueva</Link>
          </div>
          {!renewals?.length ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Sin renovaciones registradas</p>
          ) : (
            <div className="space-y-1">
              {renewals.slice(0, 6).map(r => {
                const days = daysUntil(r.renewal_date)
                return (
                  <Link key={r.id} href={`/renovaciones/${r.id}`} className="flex items-center justify-between py-2 px-2 rounded hover:bg-secondary/50 transition-colors group">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground group-hover:text-primary truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{(r.clients as unknown as { name: string } | null)?.name}</p>
                    </div>
                    <div className="text-right ml-2 shrink-0">
                      <p className={`text-sm font-medium ${days < 0 ? 'text-red-400' : days <= 7 ? 'text-red-400' : days <= 30 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                        {days < 0 ? `Vencido` : days === 0 ? 'Hoy' : `${days}d`}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(r.renewal_date).toLocaleDateString('es-ES')}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Pending maintenance */}
        <div className="rounded-lg border border-border bg-card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-400" />Mantenimientos — {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <Link href="/mantenimientos" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          {!maintenances?.length ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Sin contratos de mantenimiento activos</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {maintenances.map(m => {
                const status = entryMap.get(m.id) ?? 'pending'
                return (
                  <Link key={m.id} href={`/mantenimientos/${m.id}`} className="flex items-center justify-between py-2 px-3 rounded border border-border hover:border-primary/30 hover:bg-secondary/30 transition-all group">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground group-hover:text-primary truncate">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{(m.clients as unknown as { name: string } | null)?.name}</p>
                    </div>
                    <StatusBadge status={status} />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
