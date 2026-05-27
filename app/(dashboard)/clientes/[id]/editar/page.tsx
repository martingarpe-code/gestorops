import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { ClientForm } from '@/components/clientes/client-form'

export const metadata = { title: 'Editar cliente' }

export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: client } = await supabase.from('clients').select('*').eq('id', id).single()
  if (!client) notFound()

  return (
    <>
      <PageHeader title={`Editar — ${client.name}`} />
      <div className="max-w-2xl">
        <ClientForm client={client} />
      </div>
    </>
  )
}
