import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { ProjectForm } from '@/components/proyectos/project-form'

export const metadata = { title: 'Editar proyecto' }

export default async function EditarProyectoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: project }, { data: clients }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).single(),
    supabase.from('clients').select('id, name').order('name'),
  ])
  if (!project) notFound()

  return (
    <>
      <PageHeader title={`Editar — ${project.title}`} />
      <div className="max-w-2xl">
        <ProjectForm project={project} clients={clients ?? []} />
      </div>
    </>
  )
}
