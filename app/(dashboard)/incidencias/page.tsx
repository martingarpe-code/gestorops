import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle } from 'lucide-react'

export const metadata = { title: 'Incidencias' }

export default async function IncidenciasPage() {
  const supabase = await createClient()
  const { data: incidents } = await supabase
    .from('incidents')
    .select('*, clients(name)')
    .order('opened_at', { ascending: false })

  const open = incidents?.filter(i => i.status === 'open' || i.status === 'in_progress').length ?? 0

  return (
    <>
      <PageHeader title="Incidencias" description={`${open} abiertas · ${incidents?.length ?? 0} total`}>
        <Button asChild size="sm">
          <Link href="/incidencias/nuevo"><Plus className="h-4 w-4 mr-1.5" />Nueva incidencia</Link>
        </Button>
      </PageHeader>

      {!incidents?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Sin incidencias</h3>
          <p className="text-sm text-muted-foreground mb-4">Registra problemas técnicos para hacerles seguimiento.</p>
          <Button asChild size="sm"><Link href="/incidencias/nuevo">Crear incidencia</Link></Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Incidencia</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Prioridad</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Apertura</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc, i) => (
                <tr key={inc.id} className={`border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-card/30'}`}>
                  <td className="px-4 py-3">
                    <Link href={`/incidencias/${inc.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{inc.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    <Link href={`/clientes/${inc.client_id}`} className="hover:text-foreground transition-colors">
                      {(inc.clients as { name: string } | null)?.name ?? '—'}
                    </Link>
                  </td>
                  <td className="px-4 py-3"><PriorityBadge priority={inc.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={inc.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {new Date(inc.opened_at).toLocaleDateString('es-ES')}
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
