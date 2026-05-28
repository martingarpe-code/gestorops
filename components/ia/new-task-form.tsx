'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createAITaskAction } from '@/app/(dashboard)/ia/actions'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const TASK_TYPES = [
  { value: 'analyze',             label: 'Análisis de proyecto',    level: 1, time: '~3 min', cost: '~$0.08', desc: 'Diagnóstico completo: stack, deuda técnica, calidad' },
  { value: 'security_review',     label: 'Revisión de seguridad',   level: 1, time: '~4 min', cost: '~$0.10', desc: 'Secretos, dependencias vulnerables, configuración' },
  { value: 'maintenance_monthly', label: 'Mantenimiento mensual',   level: 2, time: '~8 min', cost: '~$0.20', desc: 'Revisión completa + plan de acción priorizado' },
  { value: 'onboarding',          label: 'Onboarding de proyecto',  level: 1, time: '~5 min', cost: '~$0.12', desc: 'Ficha técnica, stack detectado, checklist inicial' },
  { value: 'update_dependencies', label: 'Actualizar dependencias', level: 3, time: '~10 min', cost: '~$0.25', desc: 'Detecta, evalúa riesgo y prepara rama con updates' },
  { value: 'generate_docs',       label: 'Generar documentación',   level: 2, time: '~6 min', cost: '~$0.15', desc: 'README, changelog, documentar endpoints' },
  { value: 'debug_incident',      label: 'Debug de incidencia',     level: 2, time: '~5 min', cost: '~$0.15', desc: 'Diagnostica causa probable y propone parche' },
  { value: 'custom',              label: 'Tarea personalizada',     level: 2, time: 'variable', cost: 'variable', desc: 'Instrucciones libres para Claude Code' },
]

const LEVEL_COLORS = ['', 'text-green-400', 'text-blue-400', 'text-amber-400', 'text-amber-500', 'text-red-400']
const LEVEL_LABELS = ['', 'Solo lectura', 'Propuesta', 'Modifica rama', 'Abre PR', 'Auto']

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Enviando tarea…' : 'Lanzar tarea'}
    </Button>
  )
}

export function NewTaskForm({ projects, incidents, initialRepos, defaultProjectId, defaultIncidentId }: {
  projects: { id: string; name: string }[]
  incidents: { id: string; title: string }[]
  initialRepos: { id: string; github_repo: string; github_owner: string }[]
  defaultProjectId?: string
  defaultIncidentId?: string
}) {
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState(defaultProjectId ?? '')
  const [selectedType, setSelectedType] = useState('analyze')
  const [repos, setRepos] = useState(initialRepos)
  const [loadingRepos, setLoadingRepos] = useState(false)

  const taskDef = TASK_TYPES.find(t => t.value === selectedType)!

  useEffect(() => {
    if (!selectedProject) { setRepos([]); return }
    setLoadingRepos(true)
    const supabase = createClient()
    supabase.from('repositories').select('id, github_repo, github_owner')
      .eq('project_id', selectedProject).eq('status', 'active')
      .then(({ data }) => { setRepos(data ?? []); setLoadingRepos(false) })
  }, [selectedProject])

  const action = createAITaskAction

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="project_id" value={selectedProject} />

      {/* Project */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Proyecto *</label>
          <select
            name="project_id_display"
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            required
            className="w-full h-8 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* Repo */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Repositorio</label>
          {loadingRepos ? (
            <p className="text-xs text-muted-foreground">Cargando repositorios…</p>
          ) : repos.length === 0 ? (
            <div className="rounded-md border border-border bg-secondary/30 px-3 py-2">
              <p className="text-xs text-muted-foreground">
                {selectedProject ? 'Sin repositorios conectados. ' : 'Selecciona un proyecto primero.'}
                {selectedProject && (
                  <button type="button" onClick={() => router.push(`/proyectos/${selectedProject}`)}
                    className="text-primary hover:underline">Conectar repositorio →</button>
                )}
              </p>
            </div>
          ) : (
            <select name="repository_id" className="w-full h-8 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="">Sin repositorio específico</option>
              {repos.map(r => <option key={r.id} value={r.id}>{r.github_owner}/{r.github_repo}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Task type */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Tipo de tarea</h2>
        <div className="grid grid-cols-1 gap-2">
          {TASK_TYPES.map(t => (
            <label key={t.value} className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors ${selectedType === t.value ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-border/80 hover:bg-secondary/30'}`}>
              <input type="radio" name="type" value={t.value} checked={selectedType === t.value}
                onChange={() => setSelectedType(t.value)} className="mt-0.5 accent-primary" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{t.label}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{t.time}</span>
                    <span className="text-xs text-muted-foreground">{t.cost}</span>
                    <span className={`text-xs font-medium ${LEVEL_COLORS[t.level]}`}>N{t.level}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Level info */}
        <div className={`flex items-center gap-2 text-xs ${LEVEL_COLORS[taskDef.level]}`}>
          <span className="font-semibold">Nivel {taskDef.level} — {LEVEL_LABELS[taskDef.level]}</span>
          {taskDef.level >= 3 && <span className="text-amber-400/80">· Requiere aprobación antes de aplicar cambios</span>}
        </div>
      </div>

      {/* Incident link for debug */}
      {selectedType === 'debug_incident' && (
        <div className="rounded-lg border border-border bg-card p-5 space-y-2">
          <label className="block text-sm font-medium text-foreground">Incidencia a depurar</label>
          <select name="incident_id" defaultValue={defaultIncidentId ?? ''} className="w-full h-8 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="">Sin incidencia específica</option>
            {incidents.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
          </select>
        </div>
      )}

      {/* Custom instructions */}
      {selectedType === 'custom' && (
        <div className="rounded-lg border border-border bg-card p-5 space-y-2">
          <label className="block text-sm font-medium text-foreground">Instrucciones para Claude Code *</label>
          <textarea name="custom_instructions" rows={4} required placeholder="Describe qué debe hacer Claude Code…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
        </div>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton />
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
