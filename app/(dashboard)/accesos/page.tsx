import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Plus, KeyRound } from 'lucide-react'

export const metadata = { title: 'Accesos Técnicos' }

const typeLabels: Record<string, string> = {
  hosting: 'Hosting', database: 'Base de datos', platform: 'Plataforma',
  api: 'API', domain: 'Dominio', email: 'Email', ssh: 'SSH', custom: 'Custom',
}

export default async function AccesosPage() {
  const supabase = await createClient()
  const { data: accesses } = await supabase
    .from('technical_accesses')
    .select('id, client_id, type, name, url, status, clients(name)')
    .order('type')
    .order('name')

  return (
    <>
      <PageHeader title="Accesos Técnicos" description={`${accesses?.length ?? 0} credenciales`}>
        <Button asChild size="sm">
          <Link href="/accesos/nuevo"><Plus className="h-4 w-4 mr-1.5" />Nuevo acceso</Link>
        </Button>
      </PageHeader>

      {!accesses?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <KeyRound className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Sin accesos registrados</h3>
          <p className="text-sm text-muted-foreground mb-4">Guarda credenciales de hosting, APIs y plataformas de forma segura.</p>
          <Button asChild size="sm"><Link href="/accesos/nuevo">Añadir acceso</Link></Button>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">URL</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {accesses.map((a, i) => (
                <tr key={a.id} className={`border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${i % 2 === 0 ? 'bg-background' : 'bg-card/30'}`}>
                  <td className="px-4 py-3">
                    <Link href={`/accesos/${a.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{a.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {(a.clients as unknown as { name: string } | null)?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{typeLabels[a.type] ?? a.type}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {a.url ? <a href={a.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary truncate block max-w-xs">{a.url}</a> : '—'}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
