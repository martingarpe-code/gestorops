import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteRenewalAction } from '../actions'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('renewals').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Renovación' }
}

export default async function RenovacionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: renewal } = await supabase.from('renewals').select('*, clients(id,name)').eq('id', id).single()
  if (!renewal) notFound()

  const deleteWithId = deleteRenewalAction.bind(null, id)
  const client = renewal.clients as { id: string; name: string } | null
  const days = Math.ceil((new Date(renewal.renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <>
      <PageHeader title={renewal.name}>
        <Button asChild variant="outline" size="sm">
          <Link href={`/renovaciones/${id}/editar`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Editar</Link>
        </Button>
        <form action={deleteWithId}>
          <Button type="submit" variant="outline" size="sm" className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />Eliminar
          </Button>
        </form>
      </PageHeader>
      <div className="max-w-lg">
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Estado', <StatusBadge key="s" status={renewal.status} />],
              ['Tipo', renewal.type],
              ['Proveedor', renewal.provider],
              ['Cliente', client ? <Link key="c" href={`/clientes/${client.id}`} className="text-primary hover:underline">{client.name}</Link> : null],
              ['Vencimiento', new Date(renewal.renewal_date).toLocaleDateString('es-ES')],
              ['Días restantes', days < 0 ? <span key="d" className="text-red-400 font-semibold">Vencido hace {Math.abs(days)}d</span> : <span key="d" className={days <= 30 ? 'text-amber-400' : 'text-foreground'}>{days}d</span>],
              ['Coste', renewal.cost ? `${renewal.cost}€` : null],
            ].map(([label, value]) => value != null ? (
              <div key={String(label)}>
                <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
                <dd className="text-foreground">{value}</dd>
              </div>
            ) : null)}
          </dl>
          {renewal.notes && <div className="pt-2 border-t border-border"><p className="text-xs text-muted-foreground mb-1">Notas</p><p className="text-sm text-foreground">{renewal.notes}</p></div>}
        </div>
      </div>
    </>
  )
}
