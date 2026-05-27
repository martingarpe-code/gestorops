import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { RenewalForm } from '@/components/renovaciones/renewal-form'

export const metadata = { title: 'Nueva renovación' }

export default async function NuevaRenovacionPage({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { cliente } = await searchParams
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('id, name').order('name')
  return (
    <>
      <PageHeader title="Nueva renovación" />
      <div className="max-w-2xl">
        <RenewalForm clients={clients ?? []} defaultClientId={cliente} />
      </div>
    </>
  )
}
