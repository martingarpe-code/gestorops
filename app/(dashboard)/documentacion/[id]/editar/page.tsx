import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { DocEditor } from '@/components/documentacion/doc-editor'

export default async function EditarDocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: doc }, { data: clients }, { data: projects }] = await Promise.all([
    supabase.from('documents').select('*').eq('id', id).single(),
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('projects').select('id, title').order('title'),
  ])
  if (!doc) notFound()
  return (
    <>
      <PageHeader title={`Editar — ${doc.title}`} />
      <DocEditor doc={doc} clients={clients ?? []} projects={projects ?? []} />
    </>
  )
}
