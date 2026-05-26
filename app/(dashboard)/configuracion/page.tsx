import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Configuración' }

export default function ConfiguracionPage() {
  return (
    <>
      <PageHeader
        title="Configuración"
        description="Ajustes del sistema"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo en construcción — Bloque 1
        </p>
      </div>
    </>
  )
}
