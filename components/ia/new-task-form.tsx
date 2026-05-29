'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createAITaskAction } from '@/app/(dashboard)/ia/actions'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const TASK_TYPES = [
  { value: 'analyze',             label: 'Análisis de proyecto',    level: 1, time: '~3 min',  baseCost: 0.08,  desc: 'Diagnóstico completo: stack, deuda técnica, calidad' },
  { value: 'security_review',     label: 'Revisión de seguridad',   level: 1, time: '~4 min',  baseCost: 0.10,  desc: 'Secretos, dependencias vulnerables, configuración' },
  { value: 'maintenance_monthly', label: 'Mantenimiento mensual',   level: 2, time: '~8 min',  baseCost: 0.20,  desc: 'Revisión completa + plan de acción priorizado' },
  { value: 'onboarding',          label: 'Onboarding de proyecto',  level: 1, time: '~5 min',  baseCost: 0.12,  desc: 'Ficha técnica, stack detectado, checklist inicial' },
  { value: 'update_dependencies', label: 'Actualizar dependencias', level: 3, time: '~10 min', baseCost: 0.25,  desc: 'Detecta, evalúa riesgo y prepara rama con updates' },
  { value: 'generate_docs',       label: 'Generar documentación',   level: 2, time: '~6 min',  baseCost: 0.15,  desc: 'README, changelog, documentar endpoints' },
  { value: 'debug_incident',      label: 'Debug de incidencia',     level: 2, time: '~5 min',  baseCost: 0.15,  desc: 'Diagnostica causa probable y propone parche' },
  { value: 'custom',              label: 'Tarea personalizada',     level: 2, time: 'variable', baseCost: 0,     desc: 'Instrucciones libres para Claude Code' },
]

const MODELS = [
  { value: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5',   badge: 'Rápido',       multiplier: 0.25, color: 'text-green-400' },
  { value: 'claude-sonnet-4-6',         label: 'Sonnet 4.6',  badge: 'Recomendado',  multiplier: 1.0,  color: 'text-blue-400' },
  { value: 'claude-opus-4-7',           label: 'Opus 4.7',    badge: 'Máx. calidad', multiplier: 5.0,  color: 'text-amber-400' },
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
  const [selectedModel, setSelectedModel] = useState('claude-sonnet-4-6')
  const [selectedRepo, setSelectedRepo] = useState('')
  const [repos, setRepos] = useState(initialRepos)
  const [loadingRepos, setLoadingRepos] = useState(false)

  const taskDef = TASK_TYPES.find(t => t.value === selectedType)!
  const modelDef = MODELS.find(m => m.value === selectedModel)!
  const estimatedCost = taskDef.baseCost > 0
    ? `~$${(taskDef.baseCost * modelDef.multiplier).toFixed(2)}`
    : 'variable'

  useEffect(() => {
    setSelectedRepo('')
    if (!selectedProject) { setRepos([]); return }
    setLoadingRepos(true)
    let isMounted = true
    const supabase = createClient()
    supabase.from('repositories').select('id, github_repo, github_owner')
      .eq('project_id', selectedProject).eq('status', 'active')
      .then(({ data }) => {
        if (isMounted) { setRepos(data ?? []); setLoadingRepos(false) }
      })
    return () => { isMounted = false }
  }, [selectedProject])

  return (
    <form action={createAITaskAction} className="space-y-4">
      <input type="hidden" name="project_id" value={selectedProject} />
      <input type="hidden" name="model" value={selectedModel} />

      {/* Project + repo */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Proyecto *</label>
          <select
            name="_project_selector"
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            required
            className="w-full h-8 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

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
            <div className="space-y-1.5">
              <select
                name="repository_id"
                value={selectedRepo}
                onChange={e => setSelectedRepo(e.target.value)}
                className={`w-full h-8 rounded-lg border bg-background px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 ${!selectedRepo ? 'border-amber-500/50' : 'border-border'}`}
              >
                <option value="">Sin repositorio específico</option>
                {repos.map(r => <option key={r.id} value={r.id}>{r.github_owner}/{r.github_repo}</option>)}
              </select>
              {!selectedRepo && (
                <p className="flex items-center gap-1.5 text-xs text-amber-400">
                  <span>⚠</span> Sin repositorio el worker no analizará código — solo el contexto del gestor.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Model selector */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Modelo</h2>
        <div className="grid grid-cols-3 gap-2">
          {MODELS.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setSelectedModel(m.value)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors ${
                selectedModel === m.value
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border hover:border-border/80 hover:bg-secondary/30'
              }`}
            >
              <span className={`text-xs font-semibold ${m.color}`}>{m.label}</span>
              <span className="text-[10px] text-muted-foreground">{m.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task type */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Tipo de tarea</h2>
        <div className="grid grid-cols-1 gap-2">
          {TASK_TYPES.map(t => {
            const cost = t.baseCost > 0 ? `~$${(t.baseCost * modelDef.multiplier).toFixed(2)}` : 'variable'
            return (
              <label key={t.value} className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors ${selectedType === t.value ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-border/80 hover:bg-secondary/30'}`}>
                <input type="radio" name="type" value={t.value} checked={selectedType === t.value}
                  onChange={() => setSelectedType(t.value)} className="mt-0.5 accent-primary" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{t.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{t.time}</span>
                      <span className="text-xs text-muted-foreground">{cost}</span>
                      <span className={`text-xs font-medium ${LEVEL_COLORS[t.level]}`}>N{t.level}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
              </label>
            )
          })}
        </div>

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

      {/* Summary + submit */}
      <div className="rounded-lg border border-border bg-card px-4 py-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{modelDef.label} · {taskDef.label} · Est. {estimatedCost}</span>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
