'use client'

import { useFormStatus } from 'react-dom'
import { createInfraAction, updateInfraAction } from '@/app/(dashboard)/infraestructura/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Tables } from '@/types/database'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Guardando...' : isEdit ? 'Guardar' : 'Crear servicio'}</Button>
}

export function InfraForm({ item, clients, defaultClientId }: {
  item?: Tables<'infrastructure_items'>
  clients: { id: string; name: string }[]
  defaultClientId?: string
}) {
  const isEdit = !!item
  const action = isEdit ? updateInfraAction.bind(null, item.id) : createInfraAction

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Cliente *</label>
          <select name="client_id" defaultValue={item?.client_id ?? defaultClientId ?? ''} required className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="" disabled>Selecciona un cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Categoría *</label>
            <select name="category" defaultValue={item?.category ?? 'server'} required className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="server">Servidor</option>
              <option value="database">Base de datos</option>
              <option value="cdn">CDN</option>
              <option value="platform">Plataforma</option>
              <option value="email">Email</option>
              <option value="monitoring">Monitoreo</option>
              <option value="storage">Storage</option>
              <option value="custom">Otro</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Estado</label>
            <select name="status" defaultValue={item?.status ?? 'active'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="unknown">Desconocido</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Nombre *</label>
          <Input name="name" defaultValue={item?.name} required placeholder="ej: VPS Principal, PostgreSQL Producción" className="bg-background border-border" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Proveedor</label>
          <Input name="provider" defaultValue={item?.provider ?? ''} placeholder="AWS, Hetzner, Cloudflare…" className="bg-background border-border" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">URL / Endpoint</label>
          <Input name="url" defaultValue={item?.url ?? ''} placeholder="https://…" className="bg-background border-border" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" defaultValue={item?.description ?? ''} rows={2} placeholder="Detalles técnicos relevantes…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button type="button" variant="outline" onClick={() => history.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
