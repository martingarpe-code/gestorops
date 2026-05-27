'use client'

import { useFormStatus } from 'react-dom'
import { createMaintenanceAction, updateMaintenanceAction } from '@/app/(dashboard)/mantenimientos/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Tables } from '@/types/database'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear contrato'}</Button>
}

export function MaintenanceForm({ maintenance, clients, defaultClientId }: {
  maintenance?: Tables<'maintenances'>
  clients: { id: string; name: string }[]
  defaultClientId?: string
}) {
  const isEdit = !!maintenance
  const action = isEdit ? updateMaintenanceAction.bind(null, maintenance.id) : createMaintenanceAction

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Cliente *</label>
          <select name="client_id" defaultValue={maintenance?.client_id ?? defaultClientId ?? ''} required className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="" disabled>Selecciona un cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Nombre del contrato *</label>
          <Input name="name" defaultValue={maintenance?.name} required placeholder="ej: Mantenimiento web mensual" className="bg-background border-border" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" defaultValue={maintenance?.description ?? ''} rows={2} placeholder="Descripción del servicio incluido…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Tipo</label>
            <Input name="type" defaultValue={maintenance?.type ?? 'monthly'} placeholder="monthly" className="bg-background border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Facturación</label>
            <select name="billing_period" defaultValue={maintenance?.billing_period ?? 'monthly'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Precio (€)</label>
            <Input name="price" type="number" step="0.01" defaultValue={maintenance?.price?.toString()} placeholder="0.00" className="bg-background border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Estado</label>
            <select name="status" defaultValue={maintenance?.status ?? 'active'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Fecha inicio</label>
            <Input name="start_date" type="date" defaultValue={maintenance?.start_date ?? ''} className="bg-background border-border" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button type="button" variant="outline" onClick={() => history.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
