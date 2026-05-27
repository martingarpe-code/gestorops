'use client'

import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createIncidentAction, updateIncidentAction } from '@/app/(dashboard)/incidencias/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Tables } from '@/types/database'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear incidencia'}</Button>
}

export function IncidentForm({ incident, clients, projects, defaultClientId, defaultProjectId }: {
  incident?: Tables<'incidents'>
  clients: { id: string; name: string }[]
  projects: { id: string; title: string; client_id: string }[]
  defaultClientId?: string
  defaultProjectId?: string
}) {
  const router = useRouter()
  const isEdit = !!incident
  const action = isEdit ? updateIncidentAction.bind(null, incident.id) : createIncidentAction

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Cliente *</label>
          <select name="client_id" defaultValue={incident?.client_id ?? defaultClientId ?? ''} required className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="" disabled>Selecciona un cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Proyecto (opcional)</label>
          <select name="project_id" defaultValue={incident?.project_id ?? defaultProjectId ?? ''} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="">Sin proyecto asociado</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Título *</label>
          <Input name="title" defaultValue={incident?.title} required placeholder="Descripción breve del problema" className="bg-background border-border" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" defaultValue={incident?.description ?? ''} rows={3} placeholder="Detalles del problema, pasos para reproducir…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Prioridad</label>
            <select name="priority" defaultValue={incident?.priority ?? 'medium'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
          {isEdit && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Estado</label>
              <select name="status" defaultValue={incident?.status ?? 'open'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
                <option value="open">Abierta</option>
                <option value="in_progress">En curso</option>
                <option value="waiting_client">Esperando cliente</option>
                <option value="resolved">Resuelta</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>
          )}
        </div>
        {isEdit && (
          <>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Notas de resolución</label>
              <textarea name="resolution_notes" defaultValue={incident?.resolution_notes ?? ''} rows={3} placeholder="Cómo se resolvió el problema…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Horas invertidas</label>
              <Input name="hours_spent" type="number" step="0.5" defaultValue={incident?.hours_spent?.toString()} placeholder="0" className="bg-background border-border w-32" />
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
