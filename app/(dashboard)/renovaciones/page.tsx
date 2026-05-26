import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Renovaciones' }

export default function RenovacionesPage() {
  return (
    <>
      <PageHeader
        title="Renovaciones"
        description="Control de vencimientos"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo en construcción — Bloque 1
        </p>
      </div>
    </>
  )
}
