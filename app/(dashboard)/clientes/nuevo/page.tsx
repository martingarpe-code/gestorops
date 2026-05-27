import { PageHeader } from '@/components/shared/page-header'
import { ClientForm } from '@/components/clientes/client-form'

export const metadata = { title: 'Nuevo cliente' }

export default function NuevoClientePage() {
  return (
    <>
      <PageHeader title="Nuevo cliente" description="Añade un nuevo cliente al sistema" />
      <div className="max-w-2xl">
        <ClientForm />
      </div>
    </>
  )
}
