import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge'
import { Button } from '@/components/ui/button'
import { Plus, CheckSquare } from 'lucide-react'
import { updateTaskStatusAction } from './actions'

export const metadata = { title: 'Tareas' }

const COLUMNS = [
  { status: 'todo',        label: 'Pendiente' },
  { status: 'in_progress', label: 'En curso'  },
  { status: 'done',        label: 'Hecho'     },
]

export default async function TareasPage() {
  const supabase = await createClient()
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, clients(name), projects(title)')
    .neq('status', 'cancelled')
    .order('priority')
    .order('due_date', { ascending: true, nullsFirst: false })

  const byStatus = (status: string) => tasks?.filter(t => t.status === status) ?? []

  return (
    <>
      <PageHeader title="Tareas" description={`${tasks?.filter(t => t.status !== 'done').length ?? 0} activas`}>
        <Button asChild size="sm">
          <Link href="/tareas/nuevo"><Plus className="h-4 w-4 mr-1.5" />Nueva tarea</Link>
        </Button>
      </PageHeader>

      {!tasks?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <CheckSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-1">Sin tareas</h3>
          <p className="text-sm text-muted-foreground mb-4">Crea work items internos para organizar el trabajo.</p>
          <Button asChild size="sm"><Link href="/tareas/nuevo">Crear tarea</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(col => (
            <div key={col.status} className="rounded-lg border border-border bg-card/50 p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{col.label}</span>
                <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{byStatus(col.status).length}</span>
              </div>
              <div className="space-y-2">
                {byStatus(col.status).map(task => (
                  <div key={task.id} className="rounded-md border border-border bg-card p-3 group hover:border-primary/30 transition-colors">
                    <Link href={`/tareas/${task.id}`} className="block">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">{task.title}</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <PriorityBadge priority={task.priority} />
                        {(task.clients as { name: string } | null)?.name && (
                          <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded truncate max-w-24">
                            {(task.clients as { name: string }).name}
                          </span>
                        )}
                        {task.due_date && (
                          <span className={`text-xs px-1.5 py-0.5 rounded ${new Date(task.due_date) < new Date() ? 'text-red-400 bg-red-500/10' : 'text-muted-foreground bg-secondary'}`}>
                            {new Date(task.due_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </Link>
                    {/* Quick status move buttons */}
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {COLUMNS.filter(c => c.status !== col.status).map(c => {
                        const action = updateTaskStatusAction.bind(null, task.id, c.status)
                        return (
                          <form key={c.status} action={action}>
                            <button type="submit" className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-secondary">
                              → {c.label}
                            </button>
                          </form>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {byStatus(col.status).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">Sin tareas</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
