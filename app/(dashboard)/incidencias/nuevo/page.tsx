import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { IncidentForm } from '@/components/incidencias/incident-form'

export const metadata = { title: 'Nueva incidencia' }

export default async function NuevaIncidenciaPage({ searchParams }: { searchParams: Promise<{ cliente?: string; proyecto?: string }> }) {
  const { cliente, proyecto } = await searchParams
  const supabase = await createClient()
  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('projects').select('id, title, client_id').order('title'),
  ])
  return (
    <>
      <PageHeader title="Nueva incidencia" />
      <div className="max-w-2xl">
        <IncidentForm clients={clients ?? []} projects={projects ?? []} defaultClientId={cliente} defaultProjectId={proyecto} />
      </div>
    </>
  )
}
