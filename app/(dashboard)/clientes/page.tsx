import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { ListFilter } from '@/components/shared/list-filter'
import { Plus, Users } from 'lucide-react'

export const metadata = { title: 'Clientes' }

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>
}) {
  const { q, type } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('clients').select('*').order('name')
  if (q) query = query.ilike('name', `%${q}%`)
  if (type && type !== 'all') query = query.eq('type', type)

  const { data: clients } = await query

  return (
    <>
      <PageHeader title="Clientes" description={`${clients?.length ?? 0} clientes`}>
        <Suspense fallback={null}>
          <ListFilter placeholder="Buscar clientes…" />
        </Suspense>
        <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden text-xs">
          {(['all', 'active', 'inactive', 'prospect'] as const).map(t => {
            const labels = { all: 'Todos', active: 'Activos', inactive: 'Inactivos', prospect: 'Prospectos' }
            const isActive = (type ?? 'all') === t
            return (
              <Link key={t} href={`/clientes${t !== 'all' ? `?type=${t}` : ''}`}
                className={`px-2.5 py-1.5 transition-colors ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
                {labels[t]}
              </Link>
            )
          })}
        </div>
        <Button asChild size="sm">
          <Link href="/clientes/nuevo"><Plus className="h-4 w-4 mr-1.5" />Nuevo cliente</Link>
        </Button>
      </PageHeader>

      {!clients?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">
            {q ? `Sin resultados para "${q}"` : 'Sin clientes todavía'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {q ? 'Prueba con otro término de búsqueda.' : 'Añade tu primer cliente para empezar.'}
          </p>
          {!q && <Button asChild size="sm"><Link href="/clientes/nuevo">Añadir cliente</Link></Button>}
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Empresa</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Sector</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Email</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, i) => (
                <tr key={client.id} className={`border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-card/30'}`}>
                  <td className="px-4 py-3">
                    <Link href={`/clientes/${client.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {client.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{client.company ?? '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{client.sector ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={client.type} /></td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{client.email ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
