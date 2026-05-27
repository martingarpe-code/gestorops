import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteInfraAction } from '../actions'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('infrastructure_items').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Servicio' }
}

const categoryLabels: Record<string, string> = {
  server: 'Servidor', database: 'Base de datos', cdn: 'CDN',
  platform: 'Plataforma', email: 'Email', monitoring: 'Monitoreo',
  storage: 'Storage', custom: 'Otro',
}

export default async function InfraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: item } = await supabase.from('infrastructure_items').select('*, clients(id,name)').eq('id', id).single()
  if (!item) notFound()

  const deleteWithId = deleteInfraAction.bind(null, id)
  const client = item.clients as { id: string; name: string } | null

  return (
    <>
      <PageHeader title={item.name} description={categoryLabels[item.category] ?? item.category}>
        <Button asChild variant="outline" size="sm">
          <Link href={`/infraestructura/${id}/editar`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Editar</Link>
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
              ['Cliente', client ? <Link key="c" href={`/clientes/${client.id}`} className="text-primary hover:underline">{client.name}</Link> : null],
              ['Categoría', categoryLabels[item.category] ?? item.category],
              ['Estado', <StatusBadge key="s" status={item.status} />],
              ['Proveedor', item.provider],
              ['URL', item.url ? <a key="u" href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{item.url}</a> : null],
            ].map(([label, value]) => value != null ? (
              <div key={String(label)}>
                <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
                <dd className="text-foreground">{value}</dd>
              </div>
            ) : null)}
          </dl>
          {item.description && <div className="pt-2 border-t border-border"><p className="text-xs text-muted-foreground mb-1">Descripción</p><p className="text-sm text-foreground">{item.description}</p></div>}
        </div>
      </div>
    </>
  )
}
