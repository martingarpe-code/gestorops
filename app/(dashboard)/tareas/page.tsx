import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Tareas' }

export default function TareasPage() {
  return (
    <>
      <PageHeader
        title="Tareas"
        description="Work items internos"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo en construcción — Bloque 1
        </p>
      </div>
    </>
  )
}
