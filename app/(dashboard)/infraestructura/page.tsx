import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Plus, Server } from 'lucide-react'

export const metadata = { title: 'Infraestructura' }

const categoryLabels: Record<string, string> = {
  server: 'Servidor', database: 'Base de datos', cdn: 'CDN',
  platform: 'Plataforma', email: 'Email', monitoring: 'Monitoreo',
  storage: 'Storage', custom: 'Otro',
}

const categoryIcons: Record<string, string> = {
  server: '🖥️', database: '🗄️', cdn: '🌐', platform: '⚡',
  email: '📧', monitoring: '📊', storage: '💾', custom: '🔧',
}

export default async function InfraestructuraPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('infrastructure_items')
    .select('*, clients(name)')
    .order('category')
    .order('name')

  // Group by client
  const byClient = new Map<string, { clientName: string; items: typeof items }>()
  items?.forEach(item => {
    const clientName = (item.clients as { name: string } | null)?.name ?? 'Sin cliente'
    if (!byClient.has(item.client_id)) {
      byClient.set(item.client_id, { clientName, items: [] })
    }
    byClient.get(item.client_id)!.items!.push(item)
  })

  return (
    <>
      <PageHeader title="Infraestructura" description={`${items?.length ?? 0} servicios registrados`}>
        <Button asChild size="sm">
          <Link href="/infraestructura/nuevo"><Plus className="h-4 w-4 mr-1.5" />Nuevo servicio</Link>
        </Button>
      </PageHeader>

      {!items?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <Server className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Sin servicios registrados</h3>
          <p className="text-sm text-muted-foreground mb-4">Documenta el stack técnico de cada cliente.</p>
          <Button asChild size="sm"><Link href="/infraestructura/nuevo">Añadir servicio</Link></Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(byClient.entries()).map(([clientId, { clientName, items: clientItems }]) => (
            <div key={clientId}>
              <div className="flex items-center gap-2 mb-3">
                <Link href={`/clientes/${clientId}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">{clientName}</Link>
                <span className="text-xs text-muted-foreground">({clientItems?.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {clientItems?.map(item => (
                  <Link key={item.id} href={`/infraestructura/${item.id}`} className="rounded-lg border border-border bg-card p-3 hover:border-primary/30 transition-colors group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{categoryIcons[item.category] ?? '🔧'}</span>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{categoryLabels[item.category] ?? item.category}</p>
                        </div>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    {item.provider && <p className="text-xs text-muted-foreground">{item.provider}</p>}
                    {item.url && <p className="text-xs text-primary truncate">{item.url}</p>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
