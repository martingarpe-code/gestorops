import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { DocEditor } from '@/components/documentacion/doc-editor'

export const metadata = { title: 'Nuevo documento' }

export default async function NuevoDocPage({ searchParams }: { searchParams: Promise<{ cliente?: string; proyecto?: string }> }) {
  const { cliente, proyecto } = await searchParams
  const supabase = await createClient()
  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from('clients').select('id, name').order('name'),
    supabase.from('projects').select('id, title').order('title'),
  ])
  return (
    <>
      <PageHeader title="Nuevo documento" />
      <DocEditor clients={clients ?? []} projects={projects ?? []} defaultClientId={cliente} defaultProjectId={proyecto} />
    </>
  )
}
