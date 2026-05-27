import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Plus, FolderKanban } from 'lucide-react'

export const metadata = { title: 'Proyectos' }

export default async function ProyectosPage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, clients(name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <PageHeader title="Proyectos" description={`${projects?.length ?? 0} proyectos`}>
        <Button asChild size="sm">
          <Link href="/proyectos/nuevo"><Plus className="h-4 w-4 mr-1.5" />Nuevo proyecto</Link>
        </Button>
      </PageHeader>

      {!projects?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <FolderKanban className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Sin proyectos todavía</h3>
          <p className="text-sm text-muted-foreground mb-4">Crea tu primer proyecto asociado a un cliente.</p>
          <Button asChild size="sm"><Link href="/proyectos/nuevo">Crear proyecto</Link></Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Proyecto</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Prioridad</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Inicio</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-card/30'}`}>
                  <td className="px-4 py-3">
                    <Link href={`/proyectos/${p.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{p.title}</Link>
                    {p.description && <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{p.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    <Link href={`/clientes/${p.client_id}`} className="hover:text-foreground transition-colors">
                      {(p.clients as { name: string } | null)?.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><PriorityBadge priority={p.priority} /></td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {p.start_date ? new Date(p.start_date).toLocaleDateString('es-ES') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
