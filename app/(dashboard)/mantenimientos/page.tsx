import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Plus, Wrench } from 'lucide-react'

export const metadata = { title: 'Mantenimientos' }

const currentPeriod = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default async function MantenimientosPage() {
  const supabase = await createClient()
  const period = currentPeriod()

  const { data: maintenances } = await supabase
    .from('maintenances')
    .select('*, clients(name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const { data: entries } = await supabase
    .from('maintenance_entries')
    .select('maintenance_id, status')
    .eq('period', period)

  const entryMap = new Map(entries?.map(e => [e.maintenance_id, e.status]) ?? [])
  const pendingCount = maintenances?.filter(m => !entryMap.has(m.id) || entryMap.get(m.id) === 'pending').length ?? 0

  return (
    <>
      <PageHeader title="Mantenimientos" description={`${pendingCount} pendientes este mes · ${maintenances?.length ?? 0} contratos activos`}>
        <Button asChild size="sm">
          <Link href="/mantenimientos/nuevo"><Plus className="h-4 w-4 mr-1.5" />Nuevo contrato</Link>
        </Button>
      </PageHeader>

      {!maintenances?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <Wrench className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Sin contratos de mantenimiento</h3>
          <p className="text-sm text-muted-foreground mb-4">Registra los servicios de mantenimiento recurrente.</p>
          <Button asChild size="sm"><Link href="/mantenimientos/nuevo">Crear contrato</Link></Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contrato</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Precio</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Este mes</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Estado</th>
              </tr>
            </thead>
            <tbody>
              {maintenances.map((m, i) => {
                const monthStatus = entryMap.get(m.id) ?? 'pending'
                return (
                  <tr key={m.id} className={`border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-card/30'}`}>
                    <td className="px-4 py-3">
                      <Link href={`/mantenimientos/${m.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{m.name}</Link>
                      {m.description && <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{m.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {(m.clients as { name: string } | null)?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {m.price ? `${m.price}€/${m.billing_period === 'monthly' ? 'mes' : m.billing_period === 'quarterly' ? 'trim' : 'año'}` : '—'}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={monthStatus} /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><StatusBadge status={m.status} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
