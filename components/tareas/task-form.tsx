'use client'

import { useFormStatus } from 'react-dom'
import { createTaskAction, updateTaskAction } from '@/app/(dashboard)/tareas/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Tables } from '@/types/database'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Guardando...' : isEdit ? 'Guardar' : 'Crear tarea'}</Button>
}

export function TaskForm({ task, clients, projects, defaultClientId, defaultProjectId }: {
  task?: Tables<'tasks'>
  clients: { id: string; name: string }[]
  projects: { id: string; title: string; client_id: string }[]
  defaultClientId?: string
  defaultProjectId?: string
}) {
  const isEdit = !!task
  const action = isEdit ? updateTaskAction.bind(null, task.id) : createTaskAction

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Título *</label>
          <Input name="title" defaultValue={task?.title} required placeholder="¿Qué hay que hacer?" className="bg-background border-border" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" defaultValue={task?.description ?? ''} rows={3} placeholder="Detalles adicionales…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Prioridad</label>
            <select name="priority" defaultValue={task?.priority ?? 'medium'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Estado</label>
            <select name="status" defaultValue={task?.status ?? 'todo'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="todo">Pendiente</option>
              <option value="in_progress">En curso</option>
              <option value="done">Hecho</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Fecha límite</label>
            <Input name="due_date" type="date" defaultValue={task?.due_date ?? ''} className="bg-background border-border" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Cliente (opcional)</label>
          <select name="client_id" defaultValue={task?.client_id ?? defaultClientId ?? ''} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="">Sin cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Proyecto (opcional)</label>
          <select name="project_id" defaultValue={task?.project_id ?? defaultProjectId ?? ''} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="">Sin proyecto</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button type="button" variant="outline" onClick={() => history.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
