import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCcw } from 'lucide-react'

export const metadata = { title: 'Renovaciones' }

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function urgencyClass(days: number) {
  if (days < 0)  return 'text-red-400 font-semibold'
  if (days <= 7)  return 'text-red-400 font-semibold'
  if (days <= 30) return 'text-amber-400 font-medium'
  return 'text-muted-foreground'
}

export default async function RenovacionesPage() {
  const supabase = await createClient()
  const { data: renewals } = await supabase
    .from('renewals')
    .select('*, clients(name)')
    .eq('status', 'active')
    .order('renewal_date')

  const expiring30 = renewals?.filter(r => daysUntil(r.renewal_date) <= 30).length ?? 0

  return (
    <>
      <PageHeader title="Renovaciones" description={`${expiring30 > 0 ? `${expiring30} vencen en 30 días ·` : ''} ${renewals?.length ?? 0} activas`}>
        <Button asChild size="sm">
          <Link href="/renovaciones/nuevo"><Plus className="h-4 w-4 mr-1.5" />Nueva renovación</Link>
        </Button>
      </PageHeader>

      {!renewals?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <RefreshCcw className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Sin renovaciones</h3>
          <p className="text-sm text-muted-foreground mb-4">Registra dominios, hosting y licencias para no perder vencimientos.</p>
          <Button asChild size="sm"><Link href="/renovaciones/nuevo">Añadir renovación</Link></Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Servicio</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vencimiento</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Coste</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {renewals.map((r, i) => {
                const days = daysUntil(r.renewal_date)
                return (
                  <tr key={r.id} className={`border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-card/30'}`}>
                    <td className="px-4 py-3">
                      <Link href={`/renovaciones/${r.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{r.name}</Link>
                      {r.provider && <p className="text-xs text-muted-foreground mt-0.5">{r.provider}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {(r.clients as { name: string } | null)?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell capitalize">{r.type}</td>
                    <td className="px-4 py-3">
                      <span className="block">{new Date(r.renewal_date).toLocaleDateString('es-ES')}</span>
                      <span className={`text-xs ${urgencyClass(days)}`}>
                        {days < 0 ? `Vencido hace ${Math.abs(days)}d` : days === 0 ? 'Vence hoy' : `${days}d`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {r.cost ? `${r.cost}€` : '—'}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
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
