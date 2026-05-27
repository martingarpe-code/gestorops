import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { deleteTaskAction } from '../actions'
import { DeleteButton } from '@/components/shared/delete-button'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('tasks').select('title').eq('id', id).single()
  return { title: data?.title ?? 'Tarea' }
}

export default async function TareaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: task } = await supabase.from('tasks').select('*, clients(id,name), projects(id,title)').eq('id', id).single()
  if (!task) notFound()

  const deleteWithId = deleteTaskAction.bind(null, id)
  const client = task.clients as { id: string; name: string } | null
  const project = task.projects as { id: string; title: string } | null

  return (
    <>
      <PageHeader
        title={task.title}
        breadcrumbs={[{ label: 'Tareas', href: '/tareas' }, { label: task.title }]}>
        <Button asChild variant="outline" size="sm">
          <Link href={`/tareas/${id}/editar`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Editar</Link>
        </Button>
        <DeleteButton action={deleteWithId} />
      </PageHeader>
      <div className="max-w-lg space-y-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Estado', <StatusBadge key="s" status={task.status} />],
              ['Prioridad', <PriorityBadge key="p" priority={task.priority} />],
              ['Cliente', client ? <Link key="c" href={`/clientes/${client.id}`} className="text-primary hover:underline">{client.name}</Link> : null],
              ['Proyecto', project ? <Link key="pr" href={`/proyectos/${project.id}`} className="text-primary hover:underline">{project.title}</Link> : null],
              ['Vence', task.due_date ? new Date(task.due_date).toLocaleDateString('es-ES') : null],
            ].map(([label, value]) => value != null ? (
              <div key={String(label)}>
                <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
                <dd>{value}</dd>
              </div>
            ) : null)}
          </dl>
        </div>
        {task.description && (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-2">Descripción</p>
            <p className="text-sm text-foreground whitespace-pre-wrap">{task.description}</p>
          </div>
        )}
      </div>
    </>
  )
}
