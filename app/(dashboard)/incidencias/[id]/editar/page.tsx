import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { IncidentForm } from '@/components/incidencias/incident-form'

export const metadata = { title: 'Editar incidencia' }

export default async function EditarIncidenciaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: incident }, { data: clients }, { data: projects }] = await Promise.all([
    supabase.from('incidents').select('*').eq('id', id).single(),
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('projects').select('id, title, client_id').order('title'),
  ])
  if (!incident) notFound()

  return (
    <>
      <PageHeader title={`Editar — ${incident.title}`} />
      <div className="max-w-2xl">
        <IncidentForm incident={incident} clients={clients ?? []} projects={projects ?? []} />
      </div>
    </>
  )
}
