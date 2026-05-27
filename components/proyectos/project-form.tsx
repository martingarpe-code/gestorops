'use client'

import { useFormStatus } from 'react-dom'
import { createProjectAction, updateProjectAction } from '@/app/(dashboard)/proyectos/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Tables } from '@/types/database'

function Field({ label, name, defaultValue, required, placeholder, type = 'text', className }: {
  label: string; name: string; defaultValue?: string | null; required?: boolean
  placeholder?: string; type?: string; className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <Input name={name} type={type} defaultValue={defaultValue ?? ''} required={required} placeholder={placeholder} className="bg-background border-border" />
    </div>
  )
}

function SelectField({ label, name, defaultValue, options, required }: {
  label: string; name: string; defaultValue?: string; required?: boolean
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <select name={name} defaultValue={defaultValue} required={required} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear proyecto'}</Button>
}

export function ProjectForm({ project, clients, defaultClientId }: {
  project?: Tables<'projects'>
  clients: { id: string; name: string }[]
  defaultClientId?: string
}) {
  const isEdit = !!project
  const action = isEdit ? updateProjectAction.bind(null, project.id) : createProjectAction
  const techStackValue = Array.isArray(project?.tech_stack) ? (project.tech_stack as string[]).join(', ') : ''

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Datos del proyecto</h2>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Cliente *</label>
          <select name="client_id" defaultValue={project?.client_id ?? defaultClientId ?? ''} required className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="" disabled>Selecciona un cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <Field label="Título *" name="title" defaultValue={project?.title} required placeholder="Nombre del proyecto" />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" defaultValue={project?.description ?? ''} rows={2} placeholder="Descripción breve del proyecto" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="Estado" name="status" defaultValue={project?.status ?? 'active'} options={[
            { value: 'proposal', label: 'Propuesta' }, { value: 'active', label: 'Activo' },
            { value: 'paused', label: 'Pausado' }, { value: 'completed', label: 'Completado' }, { value: 'cancelled', label: 'Cancelado' },
          ]} />
          <SelectField label="Prioridad" name="priority" defaultValue={project?.priority ?? 'medium'} options={[
            { value: 'critical', label: 'Crítica' }, { value: 'high', label: 'Alta' },
            { value: 'medium', label: 'Media' }, { value: 'low', label: 'Baja' },
          ]} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Fechas y presupuesto</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Fecha inicio" name="start_date" type="date" defaultValue={project?.start_date} />
          <Field label="Fin estimado" name="estimated_end_date" type="date" defaultValue={project?.estimated_end_date} />
          {isEdit && <Field label="Fin real" name="actual_end_date" type="date" defaultValue={project?.actual_end_date} />}
          <Field label="Presupuesto (€)" name="budget" type="number" defaultValue={project?.budget?.toString()} placeholder="0.00" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Técnico</h2>
        <Field label="Stack tecnológico" name="tech_stack" defaultValue={techStackValue} placeholder="Next.js, Supabase, Tailwind (separados por coma)" className="" />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Notas técnicas</label>
          <textarea name="notes" defaultValue={project?.notes ?? ''} rows={3} placeholder="Información técnica relevante…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button type="button" variant="outline" onClick={() => history.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
