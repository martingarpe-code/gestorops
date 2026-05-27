import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { RenewalForm } from '@/components/renovaciones/renewal-form'

export default async function EditarRenovacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: renewal }, { data: clients }] = await Promise.all([
    supabase.from('renewals').select('*').eq('id', id).single(),
    supabase.from('clients').select('id, name').order('name'),
  ])
  if (!renewal) notFound()
  return (
    <>
      <PageHeader title={`Editar — ${renewal.name}`} />
      <div className="max-w-2xl">
        <RenewalForm renewal={renewal} clients={clients ?? []} />
      </div>
    </>
  )
}
