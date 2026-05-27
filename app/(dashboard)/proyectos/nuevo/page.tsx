import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { ProjectForm } from '@/components/proyectos/project-form'

export const metadata = { title: 'Nuevo proyecto' }

export default async function NuevoProyectoPage({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { cliente } = await searchParams
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('id, name').order('name')

  return (
    <>
      <PageHeader title="Nuevo proyecto" />
      <div className="max-w-2xl">
        <ProjectForm clients={clients ?? []} defaultClientId={cliente} />
      </div>
    </>
  )
}
