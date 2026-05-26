import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Accesos Técnicos' }

export default function AccesosPage() {
  return (
    <>
      <PageHeader
        title="Accesos Técnicos"
        description="Vault de credenciales"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo en construcción — Bloque 1
        </p>
      </div>
    </>
  )
}
