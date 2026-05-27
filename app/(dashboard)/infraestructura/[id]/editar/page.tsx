import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { InfraForm } from '@/components/infraestructura/infra-form'

export default async function EditarInfraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: item }, { data: clients }] = await Promise.all([
    supabase.from('infrastructure_items').select('*').eq('id', id).single(),
    supabase.from('clients').select('id, name').order('name'),
  ])
  if (!item) notFound()
  return (
    <>
      <PageHeader title={`Editar — ${item.name}`} />
      <div className="max-w-xl">
        <InfraForm item={item} clients={clients ?? []} />
      </div>
    </>
  )
}
