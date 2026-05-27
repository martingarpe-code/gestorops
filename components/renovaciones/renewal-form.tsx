'use client'

import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createRenewalAction, updateRenewalAction } from '@/app/(dashboard)/renovaciones/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Tables } from '@/types/database'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear renovación'}</Button>
}

export function RenewalForm({ renewal, clients, defaultClientId }: {
  renewal?: Tables<'renewals'>
  clients: { id: string; name: string }[]
  defaultClientId?: string
}) {
  const router = useRouter()
  const isEdit = !!renewal
  const action = isEdit ? updateRenewalAction.bind(null, renewal.id) : createRenewalAction

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Cliente *</label>
          <select name="client_id" defaultValue={renewal?.client_id ?? defaultClientId ?? ''} required className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="" disabled>Selecciona un cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Nombre *</label>
            <Input name="name" defaultValue={renewal?.name} required placeholder="ej: dominio empresa.com" className="bg-background border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Tipo *</label>
            <select name="type" defaultValue={renewal?.type ?? 'domain'} required className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="domain">Dominio</option>
              <option value="hosting">Hosting</option>
              <option value="ssl">Certificado SSL</option>
              <option value="license">Licencia</option>
              <option value="contract">Contrato</option>
              <option value="custom">Otro</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Estado</label>
            <select name="status" defaultValue={renewal?.status ?? 'active'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="active">Activo</option>
              <option value="expired">Vencido</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Proveedor</label>
            <Input name="provider" defaultValue={renewal?.provider ?? ''} placeholder="GoDaddy, Hostinger…" className="bg-background border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Fecha de renovación *</label>
            <Input name="renewal_date" type="date" defaultValue={renewal?.renewal_date} required className="bg-background border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Coste anual (€)</label>
            <Input name="cost" type="number" step="0.01" defaultValue={renewal?.cost?.toString()} placeholder="0.00" className="bg-background border-border" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Notas</label>
          <textarea name="notes" defaultValue={renewal?.notes ?? ''} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
