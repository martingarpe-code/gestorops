import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { deleteMaintenanceAction, upsertEntryAction } from '../actions'
import { DeleteButton } from '@/components/shared/delete-button'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('maintenances').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Mantenimiento' }
}

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function currentPeriod() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function lastPeriods(n: number) {
  const periods = []
  const d = new Date()
  for (let i = 0; i < n; i++) {
    periods.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    d.setMonth(d.getMonth() - 1)
  }
  return periods
}

function periodLabel(p: string) {
  const [y, m] = p.split('-')
  return `${MONTHS_ES[parseInt(m) - 1]} ${y}`
}

export default async function MantenimientoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: maint } = await supabase.from('maintenances').select('*, clients(id,name)').eq('id', id).single()
  if (!maint) notFound()

  const periods = lastPeriods(6)
  const { data: entries } = await supabase
    .from('maintenance_entries')
    .select('*')
    .eq('maintenance_id', id)
    .in('period', periods)

  const entryMap = new Map(entries?.map(e => [e.period, e]) ?? [])
  const deleteWithId = deleteMaintenanceAction.bind(null, id)
  const client = maint.clients as { id: string; name: string } | null

  return (
    <>
      <PageHeader title={maint.name} description={client?.name}>
        <Button asChild variant="outline" size="sm">
          <Link href={`/mantenimientos/${id}/editar`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Editar</Link>
        </Button>
        <DeleteButton action={deleteWithId} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contrato</h2>
            <dl className="space-y-2 text-sm">
              {[
                ['Cliente', client ? <Link key="c" href={`/clientes/${client.id}`} className="text-primary hover:underline">{client.name}</Link> : null],
                ['Estado', <StatusBadge key="s" status={maint.status} />],
                ['Tipo', maint.type],
                ['Precio', maint.price ? `${maint.price}€/${maint.billing_period === 'monthly' ? 'mes' : maint.billing_period === 'quarterly' ? 'trim' : 'año'}` : null],
                ['Inicio', maint.start_date ? new Date(maint.start_date).toLocaleDateString('es-ES') : null],
              ].map(([label, value]) => value != null ? (
                <div key={String(label)} className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-foreground text-right">{value}</dd>
                </div>
              ) : null)}
            </dl>
            {maint.description && <p className="text-sm text-muted-foreground pt-2 border-t border-border">{maint.description}</p>}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Registro mensual</h2>
            <div className="space-y-3">
              {periods.map(period => {
                const entry = entryMap.get(period)
                const status = entry?.status ?? 'pending'
                const isCurrent = period === currentPeriod()
                const upsertWithParams = upsertEntryAction.bind(null, id, period)

                return (
                  <div key={period} className={`rounded-lg border p-3 ${isCurrent ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{periodLabel(period)}{isCurrent && <span className="ml-2 text-xs text-primary">Este mes</span>}</span>
                      <StatusBadge status={status} />
                    </div>
                    {entry?.work_done && <p className="text-xs text-muted-foreground mb-2">{entry.work_done}</p>}
                    <form action={upsertWithParams} className="flex flex-wrap gap-2">
                      <select name="status" defaultValue={status} className="h-7 rounded border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring/50">
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En curso</option>
                        <option value="completed">Completado</option>
                        <option value="invoiced">Facturado</option>
                      </select>
                      <input name="work_done" defaultValue={entry?.work_done ?? ''} placeholder="¿Qué se hizo?" className="flex-1 h-7 rounded border border-border bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/50 min-w-32" />
                      <input name="hours_spent" type="number" step="0.5" defaultValue={entry?.hours_spent?.toString() ?? ''} placeholder="h" className="w-14 h-7 rounded border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring/50" />
                      <Button type="submit" size="sm" variant="outline" className="h-7 text-xs px-3">Guardar</Button>
                    </form>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
