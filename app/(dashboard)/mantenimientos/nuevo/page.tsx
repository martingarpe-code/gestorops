import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { MaintenanceForm } from '@/components/mantenimientos/maintenance-form'

export const metadata = { title: 'Nuevo mantenimiento' }

export default async function NuevoMantenimientoPage({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { cliente } = await searchParams
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('id, name').order('name')
  return (
    <>
      <PageHeader title="Nuevo contrato de mantenimiento" />
      <div className="max-w-2xl">
        <MaintenanceForm clients={clients ?? []} defaultClientId={cliente} />
      </div>
    </>
  )
}
