import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { InfraForm } from '@/components/infraestructura/infra-form'

export const metadata = { title: 'Nuevo servicio' }

export default async function NuevoServicioPage({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { cliente } = await searchParams
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('id, name').order('name')
  return (
    <>
      <PageHeader title="Nuevo servicio de infraestructura" />
      <div className="max-w-xl">
        <InfraForm clients={clients ?? []} defaultClientId={cliente} />
      </div>
    </>
  )
}
