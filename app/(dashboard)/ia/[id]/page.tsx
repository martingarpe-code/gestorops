import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { TaskDetailView } from '@/components/ia/task-detail-view'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('ai_tasks').select('title').eq('id', id).single()
  return { title: data?.title ?? 'Tarea IA' }
}

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: task } = await supabase
    .from('ai_tasks')
    .select('*, projects(name:title), repositories(github_repo, github_owner, github_url), incidents(title)')
    .eq('id', id).single()

  if (!task) notFound()

  const [{ data: logs }, { data: artifacts }, { data: runs }, { data: approvals }] = await Promise.all([
    supabase.from('ai_task_logs').select('*').eq('task_id', id).order('created_at').limit(500),
    supabase.from('ai_task_artifacts').select('*').eq('task_id', id).order('created_at'),
    supabase.from('ai_task_runs').select('*').eq('task_id', id).order('run_number', { ascending: false }).limit(5),
    supabase.from('approvals').select('*').eq('task_id', id).order('reviewed_at', { ascending: false }),
  ])

  return (
    <>
      <PageHeader
        title={task.title ?? 'Tarea IA'}
        breadcrumbs={[{ label: 'Asistente IA', href: '/ia' }, { label: task.title ?? 'Tarea' }]}
      />
      <TaskDetailView
        task={task}
        logs={logs ?? []}
        artifacts={artifacts ?? []}
        runs={runs ?? []}
        approvals={approvals ?? []}
      />
    </>
  )
}
