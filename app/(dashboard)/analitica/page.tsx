import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Analítica' }

export default function AnaliticaPage() {
  return (
    <>
      <PageHeader
        title="Analítica"
        description="Métricas operativas"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo en construcción — Bloque 1
        </p>
      </div>
    </>
  )
}
