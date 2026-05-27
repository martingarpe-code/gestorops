import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { TaskForm } from '@/components/tareas/task-form'

export default async function EditarTareaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: task }, { data: clients }, { data: projects }] = await Promise.all([
    supabase.from('tasks').select('*').eq('id', id).single(),
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('projects').select('id, title, client_id').order('title'),
  ])
  if (!task) notFound()
  return (
    <>
      <PageHeader title={`Editar — ${task.title}`} />
      <div className="max-w-xl">
        <TaskForm task={task} clients={clients ?? []} projects={projects ?? []} />
      </div>
    </>
  )
}
