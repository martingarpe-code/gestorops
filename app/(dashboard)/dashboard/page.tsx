import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Vista operativa del estado del sistema"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Bloque 1 — módulos en construcción
        </p>
      </div>
    </>
  )
}
