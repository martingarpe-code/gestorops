import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Clientes' }

export default function ClientesPage() {
  return (
    <>
      <PageHeader
        title="Clientes"
        description="Gestión de clientes"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo en construcción — Bloque 1
        </p>
      </div>
    </>
  )
}
