import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { AccessForm } from '@/components/accesos/access-form'

export const metadata = { title: 'Nuevo acceso técnico' }

export default async function NuevoAccesoPage({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { cliente } = await searchParams
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('id, name').order('name')
  return (
    <>
      <PageHeader title="Nuevo acceso técnico" description="Las credenciales se cifran con AES-256-GCM" />
      <div className="max-w-2xl">
        <AccessForm clients={clients ?? []} defaultClientId={cliente} />
      </div>
    </>
  )
}
