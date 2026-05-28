import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { ExportButtons } from '@/components/configuracion/export-buttons'

export const metadata = { title: 'Configuración' }

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: aiStats },
    { count: clients },
    { count: projects },
    { count: incidents },
    { count: accesses },
    { count: renewals },
    { count: logs },
  ] = await Promise.all([
    supabase.from('ai_tasks').select('cost_usd, created_at').eq('status', 'completed'),
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('incidents').select('*', { count: 'exact', head: true }),
    supabase.from('technical_accesses').select('*', { count: 'exact', head: true }),
    supabase.from('renewals').select('*', { count: 'exact', head: true }),
    supabase.from('activity_log').select('*', { count: 'exact', head: true }),
  ])

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const totalSpent = (aiStats ?? []).reduce((sum, t) => sum + (t.cost_usd ?? 0), 0)
  const monthSpent = (aiStats ?? []).filter(t => t.created_at >= startOfMonth).reduce((sum, t) => sum + (t.cost_usd ?? 0), 0)
  const totalTasks = aiStats?.length ?? 0

  return (
    <>
      <PageHeader title="Configuración" description="Sistema y exportación de datos" />

      <div className="max-w-2xl space-y-6">
        {/* Account */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Cuenta</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="text-foreground font-mono text-xs">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">ID de usuario</dt>
              <dd className="text-foreground font-mono text-xs truncate max-w-48">{user?.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Último acceso</dt>
              <dd className="text-foreground text-xs">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('es-ES') : '—'}</dd>
            </div>
          </dl>
        </div>

        {/* System stats */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Datos del sistema</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['Clientes', clients],
              ['Proyectos', projects],
              ['Incidencias', incidents],
              ['Accesos', accesses],
              ['Renovaciones', renewals],
              ['Eventos log', logs],
            ].map(([label, count]) => (
              <div key={String(label)} className="text-center rounded-md bg-secondary/50 p-3">
                <p className="text-xl font-semibold text-foreground tabular-nums">{count ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* IA spending */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Gasto IA (Anthropic)</h2>
            <Link href="https://console.anthropic.com/settings/billing" target="_blank"
              className="text-xs text-primary hover:underline">Ver saldo →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center rounded-md bg-secondary/50 p-3">
              <p className="text-xl font-semibold text-foreground tabular-nums">${monthSpent.toFixed(3)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Este mes</p>
            </div>
            <div className="text-center rounded-md bg-secondary/50 p-3">
              <p className="text-xl font-semibold text-foreground tabular-nums">${totalSpent.toFixed(3)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Total acumulado</p>
            </div>
            <div className="text-center rounded-md bg-secondary/50 p-3">
              <p className="text-xl font-semibold text-foreground tabular-nums">{totalTasks}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tareas completadas</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Solo refleja el coste de tareas lanzadas desde GestorOps. El saldo real puede consultarse en la consola de Anthropic.</p>
        </div>

        {/* Export */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Exportar datos</h2>
          <p className="text-xs text-muted-foreground mb-4">Descarga tus datos en formato CSV. Los accesos técnicos no se exportan por seguridad.</p>
          <ExportButtons />
        </div>

        {/* Environment */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Entorno</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Supabase URL</dt>
              <dd className="text-foreground font-mono text-xs">{process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].replace('https://', '') ?? '—'}.supabase.co</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Cifrado de accesos</dt>
              <dd className="text-green-400 text-xs">{process.env.ENCRYPTION_SECRET ? '✓ Configurado' : '✗ No configurado'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
