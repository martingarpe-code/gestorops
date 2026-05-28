'use client'

import { useState } from 'react'
import { approveTaskAction, rejectTaskAction, cancelTaskAction } from '@/app/(dashboard)/ia/actions'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, FileText, Terminal, AlertTriangle, GitBranch, Clock } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  queued:           { label: 'En cola',              color: 'text-zinc-400',  bg: 'bg-zinc-400/10' },
  running:          { label: 'Ejecutando',            color: 'text-blue-400',  bg: 'bg-blue-400/10' },
  completed:        { label: 'Completado',            color: 'text-green-400', bg: 'bg-green-400/10' },
  failed:           { label: 'Error',                 color: 'text-red-400',   bg: 'bg-red-400/10' },
  waiting_approval: { label: 'Esperando aprobación', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  approved:         { label: 'Aprobado',              color: 'text-green-400', bg: 'bg-green-400/10' },
  rejected:         { label: 'Rechazado',             color: 'text-red-400',   bg: 'bg-red-400/10' },
  cancelled:        { label: 'Cancelado',             color: 'text-zinc-500',  bg: 'bg-zinc-500/10' },
}

const LOG_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  tool: Terminal, error: AlertTriangle, warning: AlertTriangle,
  output: FileText, system: Clock, info: Clock,
}
const LOG_COLORS: Record<string, string> = {
  tool: 'text-blue-400', error: 'text-red-400', warning: 'text-amber-400',
  output: 'text-green-400', system: 'text-muted-foreground', info: 'text-muted-foreground',
}

type Task = {
  id: string; title?: string; type: string; status: string; level: number
  result_summary?: string | null; cost_usd?: number | null; cost_tokens?: number | null
  created_at: string; completed_at?: string | null
  projects?: { name: string } | null
  repositories?: { github_repo: string; github_owner: string; github_url: string } | null
  incidents?: { title: string } | null
}
type Log = { level: string; message: string; created_at: string }
type Artifact = { type: string; filename: string; content?: string | null; size_bytes?: number | null; is_sensitive: boolean }
type Run = { run_number: number; status: string; tokens_input?: number | null; tokens_output?: number | null }
type Approval = { decision: string; notes?: string | null }

export function TaskDetailView({ task, logs, artifacts, runs, approvals }: {
  task: Task
  logs: Log[]
  artifacts: Artifact[]
  runs: Run[]
  approvals: Approval[]
}) {
  const [activeTab, setActiveTab] = useState<'logs' | 'report' | 'artifacts'>('logs')
  const [notes, setNotes] = useState('')

  const st = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.queued
  const mainReport = artifacts.find(a => a.type === 'report')
  const hasApproval = approvals.length > 0
  const canApprove = task.status === 'waiting_approval' || task.status === 'completed'

  const LEVEL_LABELS = ['', 'Solo lectura', 'Propuesta', 'Modifica rama', 'Abre PR', 'Auto']

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className={`rounded-lg border border-border ${st.bg} p-4 flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${st.color}`}>
            {task.status === 'running' && <span className="h-2 w-2 rounded-full bg-current animate-pulse" />}
            <span className="font-semibold text-sm">{st.label}</span>
          </div>
          {task.cost_usd != null && (
            <span className="text-xs text-muted-foreground">Coste: ${task.cost_usd.toFixed(4)}</span>
          )}
          {task.cost_tokens != null && (
            <span className="text-xs text-muted-foreground">{task.cost_tokens.toLocaleString()} tokens</span>
          )}
        </div>
        {task.status === 'queued' && (
          <form action={cancelTaskAction.bind(null, task.id)}>
            <Button type="submit" variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 h-7 text-xs">
              Cancelar
            </Button>
          </form>
        )}
      </div>

      {/* Approval panel */}
      {canApprove && !hasApproval && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-400">Requiere tu aprobación</span>
            <span className="text-xs text-muted-foreground">· Nivel {task.level} — revisa el informe antes</span>
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Notas opcionales…" rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/50 resize-none" />
          <div className="flex gap-2">
            <form action={approveTaskAction.bind(null, task.id, task.level, notes || undefined)}>
              <Button type="submit" size="sm" className="gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />Aprobar
              </Button>
            </form>
            <form action={rejectTaskAction.bind(null, task.id, notes || undefined)}>
              <Button type="submit" size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10">
                <XCircle className="h-3.5 w-3.5" />Rechazar
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Result summary */}
      {task.result_summary && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Resumen</h2>
          <p className="text-sm text-foreground whitespace-pre-wrap">{task.result_summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex border-b border-border mb-4">
            {(['logs', 'report', 'artifacts'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'text-foreground border-b-2 border-primary -mb-px' : 'text-muted-foreground hover:text-foreground'}`}>
                {tab === 'logs' ? `Logs (${logs.length})` : tab === 'report' ? 'Informe' : `Artefactos (${artifacts.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'logs' && (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">Sin logs todavía.</p>
              ) : (
                <div className="max-h-96 overflow-y-auto p-3 space-y-1 font-mono">
                  {logs.map((log, i) => {
                    const Icon = LOG_ICONS[log.level] ?? Clock
                    return (
                      <div key={i} className="flex items-start gap-2 text-xs py-0.5">
                        <Icon className={`h-3 w-3 mt-0.5 shrink-0 ${LOG_COLORS[log.level] ?? 'text-muted-foreground'}`} />
                        <span className={`${LOG_COLORS[log.level] ?? 'text-muted-foreground'} break-all flex-1`}>{log.message}</span>
                        <span className="text-muted-foreground/50 shrink-0 ml-auto">
                          {new Date(log.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'report' && (
            <div className="rounded-lg border border-border bg-card p-5 max-h-[500px] overflow-y-auto">
              {mainReport?.content ? (
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">{mainReport.content}</pre>
              ) : (
                <p className="text-sm text-muted-foreground">El informe se generará al completar la tarea.</p>
              )}
            </div>
          )}

          {activeTab === 'artifacts' && (
            <div className="space-y-2">
              {artifacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin artefactos todavía.</p>
              ) : artifacts.map((a, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{a.filename}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {a.type}{a.size_bytes != null ? ` · ${(a.size_bytes / 1024).toFixed(1)}KB` : ''}
                    </p>
                  </div>
                  {a.is_sensitive && <span className="text-xs text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">Sensible</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3 text-sm">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Detalles</h2>
            <dl className="space-y-2">
              {([
                ['Proyecto', task.projects?.name],
                ['Repositorio', task.repositories ? `${task.repositories.github_owner}/${task.repositories.github_repo}` : null],
                ['Incidencia', task.incidents?.title],
                ['Nivel', `${task.level} — ${LEVEL_LABELS[task.level] ?? ''}`],
                ['Creada', new Date(task.created_at).toLocaleString('es-ES')],
                ['Completada', task.completed_at ? new Date(task.completed_at).toLocaleString('es-ES') : null],
              ] as [string, string | null | undefined][]).map(([label, value]) => value ? (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-foreground text-xs mt-0.5 break-all">{value}</dd>
                </div>
              ) : null)}
            </dl>
            {task.repositories?.github_url && (
              <a href={task.repositories.github_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                <GitBranch className="h-3 w-3" />Ver en GitHub
              </a>
            )}
          </div>

          {approvals.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aprobaciones</h2>
              {approvals.map((ap, i) => (
                <div key={i} className="text-xs">
                  <span className={ap.decision === 'approved' ? 'text-green-400' : 'text-red-400'}>
                    {ap.decision === 'approved' ? '✓ Aprobado' : '✗ Rechazado'}
                  </span>
                  {ap.notes && <p className="text-muted-foreground mt-0.5">{ap.notes}</p>}
                </div>
              ))}
            </div>
          )}

          {runs.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ejecuciones</h2>
              {runs.map((r, i) => (
                <div key={i} className="text-xs flex justify-between">
                  <span className="text-muted-foreground">Run #{r.run_number}</span>
                  <span className={r.status === 'completed' ? 'text-green-400' : r.status === 'failed' ? 'text-red-400' : 'text-muted-foreground'}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
