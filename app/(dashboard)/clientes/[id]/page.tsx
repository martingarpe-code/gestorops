import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, FolderKanban, Wrench, AlertCircle, RefreshCcw } from 'lucide-react'
import { deleteClientAction } from '../actions'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('clients').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Cliente' }
}

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase.from('clients').select('*').eq('id', id).single()
  if (!client) notFound()

  const [{ data: projects }, { data: incidents }, { data: renewals }, { data: maintenances }] =
    await Promise.all([
      supabase.from('projects').select('id,title,status').eq('client_id', id).order('created_at', { ascending: false }).limit(5),
      supabase.from('incidents').select('id,title,status,priority').eq('client_id', id).order('created_at', { ascending: false }).limit(5),
      supabase.from('renewals').select('id,name,renewal_date,status').eq('client_id', id).order('renewal_date').limit(5),
      supabase.from('maintenances').select('id,name,status,price').eq('client_id', id),
    ])

  const deleteWithId = deleteClientAction.bind(null, id)

  return (
    <>
      <PageHeader title={client.name} description={client.company ?? undefined}>
        <Button asChild variant="outline" size="sm">
          <Link href={`/clientes/${id}/editar`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Editar</Link>
        </Button>
        <form action={deleteWithId}>
          <Button type="submit" variant="outline" size="sm" className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />Eliminar
          </Button>
        </form>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Información</h2>
            <dl className="space-y-2 text-sm">
              {[
                ['Estado', <StatusBadge key="s" status={client.type} />],
                ['Sector', client.sector],
                ['Email', client.email],
                ['Teléfono', client.phone],
                ['Web', client.website ? <a key="w" href={client.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block">{client.website}</a> : null],
              ].map(([label, value]) => value ? (
                <div key={String(label)} className="flex items-start justify-between gap-2">
                  <dt className="text-muted-foreground shrink-0">{label}</dt>
                  <dd className="text-foreground text-right">{value}</dd>
                </div>
              ) : null)}
            </dl>
            {client.notes && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Notas</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{client.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Relations */}
        <div className="lg:col-span-2 space-y-4">
          <RelatedSection title="Proyectos" icon={FolderKanban} href={`/proyectos?cliente=${id}`} newHref={`/proyectos/nuevo?cliente=${id}`} items={projects?.map(p => ({ id: p.id, label: p.title, badge: p.status, href: `/proyectos/${p.id}` })) ?? []} />
          <RelatedSection title="Incidencias" icon={AlertCircle} href={`/incidencias?cliente=${id}`} newHref={`/incidencias/nuevo?cliente=${id}`} items={incidents?.map(i => ({ id: i.id, label: i.title, badge: i.status, href: `/incidencias/${i.id}` })) ?? []} />
          <RelatedSection title="Renovaciones" icon={RefreshCcw} href={`/renovaciones?cliente=${id}`} newHref={`/renovaciones/nuevo?cliente=${id}`} items={renewals?.map(r => ({ id: r.id, label: r.name, badge: r.status, href: `/renovaciones/${r.id}`, meta: new Date(r.renewal_date).toLocaleDateString('es-ES') })) ?? []} />
          <RelatedSection title="Mantenimientos" icon={Wrench} href={`/mantenimientos?cliente=${id}`} newHref={`/mantenimientos/nuevo?cliente=${id}`} items={maintenances?.map(m => ({ id: m.id, label: m.name, badge: m.status, href: `/mantenimientos/${m.id}`, meta: m.price ? `${m.price}€/mes` : undefined })) ?? []} />
        </div>
      </div>
    </>
  )
}

function RelatedSection({ title, icon: Icon, href, newHref, items }: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  newHref: string
  items: { id: string; label: string; badge: string; href: string; meta?: string }[]
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Icon className="h-3.5 w-3.5" />{title}
        </h2>
        <Button asChild variant="ghost" size="sm" className="h-6 text-xs px-2">
          <Link href={newHref}>+ Añadir</Link>
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin registros</p>
      ) : (
        <div className="space-y-1">
          {items.map(item => (
            <Link key={item.id} href={item.href} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary/50 transition-colors group">
              <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate">{item.label}</span>
              <div className="flex items-center gap-2 shrink-0">
                {item.meta && <span className="text-xs text-muted-foreground">{item.meta}</span>}
                <StatusBadge status={item.badge} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
