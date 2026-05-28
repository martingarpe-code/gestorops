import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { NewTaskForm } from '@/components/ia/new-task-form'

export const metadata = { title: 'Nueva tarea IA' }

export default async function NuevaTareaIAPage({
  searchParams,
}: {
  searchParams: Promise<{ proyecto?: string; incidencia?: string }>
}) {
  const { proyecto, incidencia } = await searchParams
  const supabase = await createClient()

  const [{ data: projects }, { data: incidents }] = await Promise.all([
    supabase.from('projects').select('id, name:title, client_id').eq('status', 'active').order('title'),
    supabase.from('incidents').select('id, title').in('status', ['open', 'in_progress']).order('opened_at', { ascending: false }).limit(20),
  ])

  // Repos vinculados al proyecto seleccionado
  let repos: { id: string; github_repo: string; github_owner: string }[] = []
  if (proyecto) {
    const { data } = await supabase.from('repositories').select('id, github_repo, github_owner').eq('project_id', proyecto).eq('status', 'active')
    repos = data ?? []
  }

  return (
    <>
      <PageHeader
        title="Nueva tarea IA"
        description="Lanza Claude Code sobre un repositorio"
        breadcrumbs={[{ label: 'Asistente IA', href: '/ia' }, { label: 'Nueva tarea' }]}
      />
      <div className="max-w-xl">
        <NewTaskForm
          projects={projects ?? []}
          incidents={incidents ?? []}
          initialRepos={repos}
          defaultProjectId={proyecto}
          defaultIncidentId={incidencia}
        />
      </div>
    </>
  )
}
