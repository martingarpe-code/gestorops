import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { MaintenanceForm } from '@/components/mantenimientos/maintenance-form'

export default async function EditarMantenimientoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: maintenance }, { data: clients }] = await Promise.all([
    supabase.from('maintenances').select('*').eq('id', id).single(),
    supabase.from('clients').select('id, name').order('name'),
  ])
  if (!maintenance) notFound()
  return (
    <>
      <PageHeader title={`Editar — ${maintenance.name}`} />
      <div className="max-w-2xl">
        <MaintenanceForm maintenance={maintenance} clients={clients ?? []} />
      </div>
    </>
  )
}
