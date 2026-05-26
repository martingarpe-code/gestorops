import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Infraestructura' }

export default function InfraestructuraPage() {
  return (
    <>
      <PageHeader
        title="Infraestructura"
        description="Stack técnico por cliente"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo en construcción — Bloque 1
        </p>
      </div>
    </>
  )
}
