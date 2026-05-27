import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { deleteAccessAction } from '../actions'
import { DeleteButton } from '@/components/shared/delete-button'
import { RevealField } from '@/components/accesos/reveal-field'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('technical_accesses').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Acceso técnico' }
}

const typeLabels: Record<string, string> = {
  hosting: 'Hosting', database: 'Base de datos', platform: 'Plataforma',
  api: 'API', domain: 'Dominio', email: 'Email', ssh: 'SSH', custom: 'Custom',
}

export default async function AccesoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: access } = await supabase
    .from('technical_accesses')
    .select('id, client_id, type, name, url, status, last_verified_at, clients(id,name)')
    .eq('id', id).single()
  if (!access) notFound()

  const { data: logs } = await supabase
    .from('access_log')
    .select('action, created_at')
    .eq('access_id', id)
    .order('created_at', { ascending: false })
    .limit(5)

  const deleteWithId = deleteAccessAction.bind(null, id)
  const client = access.clients as unknown as { id: string; name: string } | null

  return (
    <>
      <PageHeader title={access.name} description={typeLabels[access.type] ?? access.type}>
        <Button asChild variant="outline" size="sm">
          <Link href={`/accesos/${id}/editar`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Editar</Link>
        </Button>
        <DeleteButton action={deleteWithId} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Credenciales cifradas</h2>
            <div className="space-y-3">
              <RevealField id={id} field="username" label="Usuario" />
              <RevealField id={id} field="password" label="Contraseña" isPassword />
              <RevealField id={id} field="notes" label="Notas" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalles</h2>
            <dl className="space-y-2 text-sm">
              {[
                ['Cliente', client ? <Link key="c" href={`/clientes/${client.id}`} className="text-primary hover:underline">{client.name}</Link> : null],
                ['Estado', <StatusBadge key="s" status={access.status} />],
                ['URL', access.url ? <a key="u" href={access.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block max-w-40">{access.url}</a> : null],
                ['Verificado', access.last_verified_at ? new Date(access.last_verified_at).toLocaleDateString('es-ES') : null],
              ].map(([label, value]) => value != null ? (
                <div key={String(label)} className="flex justify-between gap-2">
                  <dt className="text-muted-foreground shrink-0">{label}</dt>
                  <dd className="text-foreground text-right">{value}</dd>
                </div>
              ) : null)}
            </dl>
          </div>

          {logs && logs.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Últimos accesos</h2>
              <div className="space-y-1.5">
                {logs.map((log, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{log.action}</span>
                    <span className="text-muted-foreground">{new Date(log.created_at).toLocaleDateString('es-ES')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
