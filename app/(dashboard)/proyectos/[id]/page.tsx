import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Pencil, AlertCircle } from 'lucide-react'
import { deleteProjectAction } from '../actions'
import { DeleteButton } from '@/components/shared/delete-button'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('projects').select('title').eq('id', id).single()
  return { title: data?.title ?? 'Proyecto' }
}

export default async function ProyectoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase.from('projects').select('*, clients(id, name)').eq('id', id).single()
  if (!project) notFound()

  const { data: incidents } = await supabase.from('incidents').select('id,title,status,priority').eq('project_id', id).order('opened_at', { ascending: false }).limit(10)

  const deleteWithId = deleteProjectAction.bind(null, id)
  const client = project.clients as { id: string; name: string } | null
  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack as string[] : []

  return (
    <>
      <PageHeader title={project.title} description={client ? undefined : undefined}>
        <Button asChild variant="outline" size="sm">
          <Link href={`/proyectos/${id}/editar`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Editar</Link>
        </Button>
        <DeleteButton action={deleteWithId} />
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalles</h2>
            <dl className="space-y-2 text-sm">
              {[
                ['Cliente', client ? <Link key="c" href={`/clientes/${client.id}`} className="text-primary hover:underline">{client.name}</Link> : null],
                ['Estado', <StatusBadge key="s" status={project.status} />],
                ['Prioridad', <PriorityBadge key="p" priority={project.priority} />],
                ['Inicio', project.start_date ? new Date(project.start_date).toLocaleDateString('es-ES') : null],
                ['Fin estimado', project.estimated_end_date ? new Date(project.estimated_end_date).toLocaleDateString('es-ES') : null],
                ['Fin real', project.actual_end_date ? new Date(project.actual_end_date).toLocaleDateString('es-ES') : null],
                ['Presupuesto', project.budget ? `${project.budget}€` : null],
              ].map(([label, value]) => value ? (
                <div key={String(label)} className="flex items-start justify-between gap-2">
                  <dt className="text-muted-foreground shrink-0">{label}</dt>
                  <dd className="text-foreground text-right">{value}</dd>
                </div>
              ) : null)}
            </dl>
            {techStack.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Stack técnico</p>
                <div className="flex flex-wrap gap-1">
                  {techStack.map(t => (
                    <span key={t} className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {(project.description || project.notes) && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              {project.description && <div><p className="text-xs text-muted-foreground mb-1">Descripción</p><p className="text-sm text-foreground">{project.description}</p></div>}
              {project.notes && <div><p className="text-xs text-muted-foreground mb-1">Notas</p><p className="text-sm text-foreground whitespace-pre-wrap">{project.notes}</p></div>}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <AlertCircle className="h-3.5 w-3.5" />Incidencias
              </h2>
              <Button asChild variant="ghost" size="sm" className="h-6 text-xs px-2">
                <Link href={`/incidencias/nuevo?proyecto=${id}`}>+ Nueva</Link>
              </Button>
            </div>
            {!incidents?.length ? (
              <p className="text-sm text-muted-foreground">Sin incidencias registradas</p>
            ) : (
              <div className="space-y-1">
                {incidents.map(inc => (
                  <Link key={inc.id} href={`/incidencias/${inc.id}`} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary/50 transition-colors group">
                    <span className="text-sm text-foreground group-hover:text-primary truncate">{inc.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={inc.priority} />
                      <StatusBadge status={inc.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
