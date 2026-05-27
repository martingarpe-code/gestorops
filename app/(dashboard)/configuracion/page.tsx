import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { ExportButtons } from '@/components/configuracion/export-buttons'

export const metadata = { title: 'Configuración' }

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { count: clients },
    { count: projects },
    { count: incidents },
    { count: accesses },
    { count: renewals },
    { count: logs },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('incidents').select('*', { count: 'exact', head: true }),
    supabase.from('technical_accesses').select('*', { count: 'exact', head: true }),
    supabase.from('renewals').select('*', { count: 'exact', head: true }),
    supabase.from('activity_log').select('*', { count: 'exact', head: true }),
  ])

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
