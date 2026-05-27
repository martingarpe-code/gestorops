import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { deleteIncidentAction } from '../actions'
import { DeleteButton } from '@/components/shared/delete-button'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('incidents').select('title').eq('id', id).single()
  return { title: data?.title ?? 'Incidencia' }
}

export default async function IncidenciaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: inc } = await supabase.from('incidents').select('*, clients(id,name), projects(id,title)').eq('id', id).single()
  if (!inc) notFound()

  const deleteWithId = deleteIncidentAction.bind(null, id)
  const client = inc.clients as { id: string; name: string } | null
  const project = inc.projects as { id: string; title: string } | null

  return (
    <>
      <PageHeader
        title={inc.title}
        breadcrumbs={[{ label: 'Incidencias', href: '/incidencias' }, { label: inc.title }]}>
        <Button asChild variant="outline" size="sm">
          <Link href={`/incidencias/${id}/editar`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Editar</Link>
        </Button>
        <DeleteButton action={deleteWithId} />
      </PageHeader>

      <div className="max-w-2xl space-y-4">
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Estado', <StatusBadge key="s" status={inc.status} />],
              ['Prioridad', <PriorityBadge key="p" priority={inc.priority} />],
              ['Cliente', client ? <Link key="c" href={`/clientes/${client.id}`} className="text-primary hover:underline">{client.name}</Link> : null],
              ['Proyecto', project ? <Link key="pr" href={`/proyectos/${project.id}`} className="text-primary hover:underline">{project.title}</Link> : null],
              ['Apertura', new Date(inc.opened_at).toLocaleDateString('es-ES')],
              ['Cierre', inc.closed_at ? new Date(inc.closed_at).toLocaleDateString('es-ES') : null],
              ['Horas', inc.hours_spent ? `${inc.hours_spent}h` : null],
            ].map(([label, value]) => value != null ? (
              <div key={String(label)}>
                <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
                <dd className="text-foreground">{value}</dd>
              </div>
            ) : null)}
          </dl>
        </div>
        {inc.description && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Descripción</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">{inc.description}</p>
          </div>
        )}
        {inc.resolution_notes && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Resolución</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">{inc.resolution_notes}</p>
          </div>
        )}
      </div>
    </>
  )
}
