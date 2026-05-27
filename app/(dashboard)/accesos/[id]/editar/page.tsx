import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { AccessForm } from '@/components/accesos/access-form'

export default async function EditarAccesoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: access }, { data: clients }] = await Promise.all([
    supabase.from('technical_accesses').select('id,client_id,type,name,url,status').eq('id', id).single(),
    supabase.from('clients').select('id, name').order('name'),
  ])
  if (!access) notFound()
  return (
    <>
      <PageHeader title={`Editar — ${access.name}`} description="Deja en blanco usuario/contraseña para no modificarlos" />
      <div className="max-w-2xl">
        <AccessForm access={access} clients={clients ?? []} />
      </div>
    </>
  )
}
