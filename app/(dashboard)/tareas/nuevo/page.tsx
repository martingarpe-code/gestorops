import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { TaskForm } from '@/components/tareas/task-form'

export const metadata = { title: 'Nueva tarea' }

export default async function NuevaTareaPage({ searchParams }: { searchParams: Promise<{ cliente?: string; proyecto?: string }> }) {
  const { cliente, proyecto } = await searchParams
  const supabase = await createClient()
  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('projects').select('id, title, client_id').order('title'),
  ])
  return (
    <>
      <PageHeader title="Nueva tarea" />
      <div className="max-w-xl">
        <TaskForm clients={clients ?? []} projects={projects ?? []} defaultClientId={cliente} defaultProjectId={proyecto} />
      </div>
    </>
  )
}
