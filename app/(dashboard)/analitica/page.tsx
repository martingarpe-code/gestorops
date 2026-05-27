import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Analítica' }

function Bar({ value, max, color = 'bg-primary' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums w-6 text-right">{value}</span>
    </div>
  )
}

function StatBox({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${color ?? 'text-foreground'}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

export default async function AnaliticaPage() {
  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const last6months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }).reverse()

  const [
    { data: clients },
    { data: projects },
    { data: incidents },
    { data: maintenances },
    { data: renewals },
    { data: recentActivity },
    { data: clientIncidents },
  ] = await Promise.all([
    supabase.from('clients').select('type'),
    supabase.from('projects').select('status'),
    supabase.from('incidents').select('status, priority, opened_at, closed_at, hours_spent'),
    supabase.from('maintenances').select('price, billing_period, status'),
    supabase.from('renewals').select('renewal_date, cost, status').eq('status', 'active'),
    supabase.from('activity_log').select('entity_type, action, created_at').order('created_at', { ascending: false }).limit(20),
    supabase.from('incidents').select('client_id, clients(name)').gte('opened_at', new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString()),
  ])

  // Clients
  const activeClients = clients?.filter(c => c.type === 'active').length ?? 0
  const prospects = clients?.filter(c => c.type === 'prospect').length ?? 0

  // Projects
  const byProjectStatus = Object.entries(
    (projects ?? []).reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.status]: (acc[p.status] ?? 0) + 1 }), {})
  ).sort((a, b) => b[1] - a[1])

  // Incidents
  const openIncidents = incidents?.filter(i => ['open', 'in_progress'].includes(i.status)).length ?? 0
  const closedThisMonth = incidents?.filter(i => i.closed_at && i.closed_at >= startOfMonth).length ?? 0
  const avgHours = incidents?.filter(i => i.hours_spent).reduce((s, i) => s + (i.hours_spent ?? 0), 0) ?? 0
  const hoursCount = incidents?.filter(i => i.hours_spent).length ?? 0
  const avgResolution = hoursCount > 0 ? (avgHours / hoursCount).toFixed(1) : '—'

  const incidentsByMonth = last6months.map(period => ({
    period,
    count: incidents?.filter(i => i.opened_at.startsWith(period)).length ?? 0,
  }))
  const maxIncMonth = Math.max(...incidentsByMonth.map(m => m.count), 1)

  // Incidents by priority
  const byPriority = ['critical', 'high', 'medium', 'low'].map(p => ({
    label: p, count: incidents?.filter(i => i.priority === p).length ?? 0,
  }))
  const maxPriority = Math.max(...byPriority.map(p => p.count), 1)

  // Top clients by incidents
  const clientMap = new Map<string, { name: string; count: number }>()
  clientIncidents?.forEach(i => {
    const name = (i.clients as unknown as { name: string } | null)?.name ?? 'Desconocido'
    const prev = clientMap.get(i.client_id) ?? { name, count: 0 }
    clientMap.set(i.client_id, { name, count: prev.count + 1 })
  })
  const topClients = Array.from(clientMap.values()).sort((a, b) => b.count - a.count).slice(0, 5)
  const maxClient = Math.max(...topClients.map(c => c.count), 1)

  // MRR
  const mrr = (maintenances ?? []).reduce((sum, m) => {
    if (m.status !== 'active') return sum
    if (m.billing_period === 'monthly') return sum + (m.price ?? 0)
    if (m.billing_period === 'quarterly') return sum + (m.price ?? 0) / 3
    if (m.billing_period === 'yearly') return sum + (m.price ?? 0) / 12
    return sum
  }, 0)

  // Upcoming renewals cost (next 90 days)
  const upcoming90 = (renewals ?? []).filter(r => {
    const days = Math.ceil((new Date(r.renewal_date).getTime() - Date.now()) / 86400000)
    return days >= 0 && days <= 90
  }).reduce((s, r) => s + (r.cost ?? 0), 0)

  const statusLabels: Record<string, string> = {
    proposal: 'Propuesta', active: 'Activo', paused: 'Pausado', completed: 'Completado', cancelled: 'Cancelado'
  }
  const priorityLabels: Record<string, string> = { critical: 'Crítica', high: 'Alta', medium: 'Media', low: 'Baja' }
  const priorityColors: Record<string, string> = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-amber-500', low: 'bg-zinc-500' }
  const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

  return (
    <>
      <PageHeader title="Analítica" description="Métricas operativas del negocio" />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatBox label="Clientes activos" value={activeClients} sub={`${prospects} prospectos`} />
        <StatBox label="MRR estimado" value={`${mrr.toFixed(0)}€`} sub="ingresos mensuales recurrentes" color="text-green-400" />
        <StatBox label="Incidencias abiertas" value={openIncidents} sub={`${closedThisMonth} cerradas este mes`} color={openIncidents > 5 ? 'text-red-400' : 'text-foreground'} />
        <StatBox label="Renovaciones 90d" value={`${upcoming90.toFixed(0)}€`} sub="coste próximas renovaciones" color={upcoming90 > 0 ? 'text-amber-400' : 'text-foreground'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidencias por mes */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Incidencias por mes</h2>
          <div className="space-y-2">
            {incidentsByMonth.map(m => (
              <div key={m.period} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-8 shrink-0">
                  {monthNames[parseInt(m.period.split('-')[1]) - 1]}
                </span>
                <div className="flex-1 h-5 bg-secondary rounded overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded transition-all flex items-center"
                    style={{ width: `${Math.round((m.count / maxIncMonth) * 100)}%` }}
                  >
                    {m.count > 0 && <span className="text-xs text-white px-1.5">{m.count}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proyectos por estado */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Proyectos por estado</h2>
          <div className="space-y-3">
            {byProjectStatus.map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{statusLabels[status] ?? status}</span>
                </div>
                <Bar value={count} max={projects?.length ?? 1} />
              </div>
            ))}
            {!byProjectStatus.length && <p className="text-sm text-muted-foreground">Sin proyectos</p>}
          </div>
        </div>

        {/* Prioridad de incidencias */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Incidencias por prioridad</h2>
            <span className="text-xs text-muted-foreground">Resolución media: {avgResolution}h</span>
          </div>
          <div className="space-y-3">
            {byPriority.map(p => (
              <div key={p.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{priorityLabels[p.label]}</span>
                </div>
                <Bar value={p.count} max={maxPriority} color={priorityColors[p.label]} />
              </div>
            ))}
          </div>
        </div>

        {/* Top clientes por incidencias */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Clientes con más incidencias (6 meses)</h2>
          {topClients.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {topClients.map(c => (
                <div key={c.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground truncate">{c.name}</span>
                  </div>
                  <Bar value={c.count} max={maxClient} color="bg-amber-500/70" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
