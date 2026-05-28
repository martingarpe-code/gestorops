import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Bot, Plus } from 'lucide-react'

export const metadata = { title: 'Asistente IA' }

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  queued:           { label: 'En cola',          color: 'text-zinc-400',   dot: 'bg-zinc-400' },
  running:          { label: 'Ejecutando',        color: 'text-blue-400',   dot: 'bg-blue-400 animate-pulse' },
  completed:        { label: 'Completado',        color: 'text-green-400',  dot: 'bg-green-400' },
  failed:           { label: 'Error',             color: 'text-red-400',    dot: 'bg-red-400' },
  waiting_approval: { label: 'Esperando aprob.',  color: 'text-amber-400',  dot: 'bg-amber-400 animate-pulse' },
  approved:         { label: 'Aprobado',          color: 'text-green-400',  dot: 'bg-green-400' },
  rejected:         { label: 'Rechazado',         color: 'text-red-400',    dot: 'bg-red-400' },
  cancelled:        { label: 'Cancelado',         color: 'text-zinc-500',   dot: 'bg-zinc-500' },
}

const typeLabels: Record<string, string> = {
  analyze: 'Análisis', security_review: 'Seguridad',
  maintenance_monthly: 'Mantenimiento', debug_incident: 'Debug',
  update_dependencies: 'Dependencias', generate_docs: 'Documentación',
  onboarding: 'Onboarding', custom: 'Custom',
}

export default async function IAPage() {
  const supabase = await createClient()
  const { data: tasks } = await supabase
    .from('ai_tasks')
    .select('*, projects(name), repositories(github_repo)')
    .order('created_at', { ascending: false })
    .limit(50)

  const running = tasks?.filter(t => ['queued','running','waiting_approval'].includes(t.status)).length ?? 0

  return (
    <>
      <PageHeader title="Asistente IA" description={`${running > 0 ? `${running} activas · ` : ''}${tasks?.length ?? 0} tareas total`}>
        <Button asChild size="sm">
          <Link href="/ia/nueva"><Plus className="h-4 w-4 mr-1.5" />Nueva tarea</Link>
        </Button>
      </PageHeader>

      {!tasks?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-secondary p-5 mb-4">
            <Bot className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Sin tareas todavía</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs">
            Conecta un repositorio a un proyecto y lanza tu primer análisis.
          </p>
          <Button asChild size="sm"><Link href="/ia/nueva">Lanzar primera tarea</Link></Button>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => {
            const st = statusConfig[task.status] ?? statusConfig.queued
            return (
              <Link key={task.id} href={`/ia/${task.id}`}
                className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 hover:border-primary/30 hover:bg-card/80 transition-all group">
                <div className={`h-2 w-2 rounded-full shrink-0 ${st.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(task.projects as { name: string } | null)?.name ?? '—'}
                    {(task.repositories as { github_repo: string } | null)?.github_repo &&
                      ` · ${(task.repositories as { github_repo: string }).github_repo}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                    {typeLabels[task.type] ?? task.type}
                  </span>
                  <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>
                  {task.cost_usd && (
                    <span className="text-xs text-muted-foreground">${task.cost_usd.toFixed(3)}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(task.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
