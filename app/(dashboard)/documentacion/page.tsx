import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'

export const metadata = { title: 'Documentación' }

const typeLabels: Record<string, string> = {
  note: 'Nota', manual: 'Manual', procedure: 'Procedimiento',
  meeting: 'Reunión', decision: 'Decisión', custom: 'Otro',
}

const typeColors: Record<string, string> = {
  note: 'text-blue-400 bg-blue-500/10',
  manual: 'text-purple-400 bg-purple-500/10',
  procedure: 'text-green-400 bg-green-500/10',
  meeting: 'text-amber-400 bg-amber-500/10',
  decision: 'text-red-400 bg-red-500/10',
  custom: 'text-zinc-400 bg-zinc-500/10',
}

export default async function DocumentacionPage() {
  const supabase = await createClient()
  const { data: docs } = await supabase
    .from('documents')
    .select('*, clients(name), projects(title)')
    .order('updated_at', { ascending: false })

  return (
    <>
      <PageHeader title="Documentación" description={`${docs?.length ?? 0} documentos`}>
        <Button asChild size="sm">
          <Link href="/documentacion/nuevo"><Plus className="h-4 w-4 mr-1.5" />Nuevo documento</Link>
        </Button>
      </PageHeader>

      {!docs?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Sin documentos</h3>
          <p className="text-sm text-muted-foreground mb-4">Crea manuales, procedimientos y notas técnicas.</p>
          <Button asChild size="sm"><Link href="/documentacion/nuevo">Crear documento</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {docs.map(doc => (
            <Link key={doc.id} href={`/documentacion/${doc.id}`}
              className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors group flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 flex-1">
                  {doc.title}
                </p>
                <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${typeColors[doc.type] ?? 'text-zinc-400 bg-zinc-500/10'}`}>
                  {typeLabels[doc.type] ?? doc.type}
                </span>
              </div>
              {doc.content && (
                <p className="text-xs text-muted-foreground line-clamp-2">{doc.content.replace(/[#*`_]/g, '').slice(0, 100)}</p>
              )}
              <div className="flex items-center gap-2 mt-auto pt-1">
                {(doc.clients as { name: string } | null)?.name && (
                  <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded truncate max-w-28">
                    {(doc.clients as { name: string }).name}
                  </span>
                )}
                {(doc.projects as { title: string } | null)?.title && (
                  <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded truncate max-w-28">
                    {(doc.projects as { title: string }).title}
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(doc.updated_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {(doc.tags ?? []).slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
