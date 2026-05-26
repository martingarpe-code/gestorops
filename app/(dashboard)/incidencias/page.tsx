import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Incidencias' }

export default function IncidenciasPage() {
  return (
    <>
      <PageHeader
        title="Incidencias"
        description="Registro de incidencias"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo en construcción — Bloque 1
        </p>
      </div>
    </>
  )
}
