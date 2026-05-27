'use client'

import { useFormStatus } from 'react-dom'
import { createClientAction, updateClientAction } from '@/app/(dashboard)/clientes/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Tables } from '@/types/database'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear cliente'}
    </Button>
  )
}

export function ClientForm({ client }: { client?: Tables<'clients'> }) {
  const isEdit = !!client
  const action = isEdit
    ? updateClientAction.bind(null, client.id)
    : createClientAction

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Datos principales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre *" name="name" defaultValue={client?.name} required placeholder="Nombre del contacto" />
          <Field label="Empresa" name="company" defaultValue={client?.company ?? ''} placeholder="Nombre de la empresa" />
          <Field label="Sector" name="sector" defaultValue={client?.sector ?? ''} placeholder="Tecnología, Marketing…" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Estado</label>
            <select name="type" defaultValue={client?.type ?? 'active'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="prospect">Prospecto</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Contacto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email" name="email" type="email" defaultValue={client?.email ?? ''} placeholder="contacto@empresa.com" />
          <Field label="Teléfono" name="phone" defaultValue={client?.phone ?? ''} placeholder="+34 600 000 000" />
          <Field label="Sitio web" name="website" defaultValue={client?.website ?? ''} placeholder="https://empresa.com" className="sm:col-span-2" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-2">
        <label className="block text-sm font-medium text-foreground">Notas internas</label>
        <textarea name="notes" defaultValue={client?.notes ?? ''} rows={3} placeholder="Información adicional sobre el cliente…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button type="button" variant="outline" onClick={() => history.back()}>Cancelar</Button>
      </div>
    </form>
  )
}

function Field({ label, name, defaultValue, required, placeholder, type = 'text', className }: {
  label: string; name: string; defaultValue?: string; required?: boolean
  placeholder?: string; type?: string; className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <Input name={name} type={type} defaultValue={defaultValue} required={required} placeholder={placeholder} className="bg-background border-border" />
    </div>
  )
}
