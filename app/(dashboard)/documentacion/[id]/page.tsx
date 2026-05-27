import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { deleteDocAction } from '../actions'
import { DeleteButton } from '@/components/shared/delete-button'
import { MarkdownRenderer } from '@/components/documentacion/markdown-renderer'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('documents').select('title').eq('id', id).single()
  return { title: data?.title ?? 'Documento' }
}

const typeLabels: Record<string, string> = {
  note: 'Nota', manual: 'Manual', procedure: 'Procedimiento',
  meeting: 'Reunión', decision: 'Decisión', custom: 'Otro',
}

export default async function DocDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: doc } = await supabase.from('documents').select('*, clients(id,name), projects(id,title)').eq('id', id).single()
  if (!doc) notFound()

  const deleteWithId = deleteDocAction.bind(null, id)
  const client = doc.clients as { id: string; name: string } | null
  const project = doc.projects as { id: string; title: string } | null

  return (
    <>
      <PageHeader
        title={doc.title}
        breadcrumbs={[{ label: 'Documentación', href: '/documentacion' }, { label: doc.title }]}>
        <Button asChild variant="outline" size="sm">
          <Link href={`/documentacion/${id}/editar`}><Pencil className="h-3.5 w-3.5 mr-1.5" />Editar</Link>
        </Button>
        <DeleteButton action={deleteWithId} />
      </PageHeader>

      <div className="flex gap-6 max-w-4xl">
        <article className="flex-1 min-w-0">
          <div className="rounded-lg border border-border bg-card p-6">
            {doc.content ? <MarkdownRenderer content={doc.content} /> : <p className="text-sm text-muted-foreground">Sin contenido</p>}
          </div>
        </article>
        <aside className="w-48 shrink-0 space-y-3">
          <div className="rounded-lg border border-border bg-card p-3 space-y-2 text-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalles</p>
            <div><p className="text-xs text-muted-foreground">Tipo</p><p className="text-foreground">{typeLabels[doc.type] ?? doc.type}</p></div>
            {client && <div><p className="text-xs text-muted-foreground">Cliente</p><Link href={`/clientes/${client.id}`} className="text-primary hover:underline text-sm">{client.name}</Link></div>}
            {project && <div><p className="text-xs text-muted-foreground">Proyecto</p><Link href={`/proyectos/${project.id}`} className="text-primary hover:underline text-sm">{project.title}</Link></div>}
            <div><p className="text-xs text-muted-foreground">Actualizado</p><p className="text-foreground text-xs">{new Date(doc.updated_at).toLocaleDateString('es-ES')}</p></div>
            {doc.tags && doc.tags.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((t: string) => <span key={t} className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">{t}</span>)}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
