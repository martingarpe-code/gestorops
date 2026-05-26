import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Documentación' }

export default function DocumentacionPage() {
  return (
    <>
      <PageHeader
        title="Documentación"
        description="Base de conocimiento técnica"
      />
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Módulo en construcción — Bloque 1
        </p>
      </div>
    </>
  )
}
