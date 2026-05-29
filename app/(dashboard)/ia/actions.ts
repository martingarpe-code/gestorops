'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const TASK_TITLES: Record<string, string> = {
  analyze:              'Análisis de proyecto',
  security_review:      'Revisión de seguridad',
  maintenance_monthly:  'Mantenimiento mensual',
  debug_incident:       'Debug de incidencia',
  update_dependencies:  'Actualizar dependencias',
  generate_docs:        'Generar documentación',
  onboarding:           'Onboarding de proyecto',
  apply_suggestions:    'Aplicar fixes sugeridos',
  custom:               'Tarea personalizada',
}

const TASK_LEVELS: Record<string, number> = {
  analyze: 1, security_review: 1, onboarding: 1,
  maintenance_monthly: 2, generate_docs: 2,
  debug_incident: 2, update_dependencies: 3,
  apply_suggestions: 3, custom: 2,
}

export async function createAITaskAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const type = formData.get('type') as string
  const projectId = formData.get('project_id') as string
  const repoId = (formData.get('repository_id') as string) || null
  const incidentId = (formData.get('incident_id') as string) || null
  const customInstructions = (formData.get('custom_instructions') as string) || null
  const model = (formData.get('model') as string) || 'claude-sonnet-4-6'

  const { data, error } = await supabase.from('ai_tasks').insert({
    project_id:    projectId,
    repository_id: repoId,
    incident_id:   incidentId,
    type,
    level:         TASK_LEVELS[type] ?? 1,
    title:         TASK_TITLES[type] ?? 'Tarea IA',
    status:        'queued',
    input_params:  { ...(customInstructions ? { custom_instructions: customInstructions } : {}), model },
    created_by:    user?.id,
  }).select('id').single()

  if (error) throw new Error(error.message)
  revalidatePath('/ia', 'layout')
  redirect(`/ia/${data.id}`)
}

export async function approveTaskAction(taskId: string, level: number, notes?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  await supabase.from('approvals').insert({
    task_id: taskId, decision: 'approved',
    reviewer: user.id, level_approved: level, notes: notes ?? null,
  })
  await supabase.from('ai_tasks').update({ status: 'approved' }).eq('id', taskId)
  revalidatePath(`/ia/${taskId}`, 'layout')
}

export async function rejectTaskAction(taskId: string, notes?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  await supabase.from('approvals').insert({
    task_id: taskId, decision: 'rejected',
    reviewer: user.id, level_approved: 0, notes: notes ?? null,
  })
  await supabase.from('ai_tasks').update({ status: 'rejected' }).eq('id', taskId)
  revalidatePath('/ia', 'layout')
  redirect('/ia?toast=Tarea+rechazada')
}

export async function applyFixesAction(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  // Get original task + report artifact
  const { data: original } = await supabase
    .from('ai_tasks')
    .select('*, ai_task_artifacts(*)')
    .eq('id', taskId).single()

  if (!original) throw new Error('Tarea no encontrada')
  if (!original.repository_id) throw new Error('Esta tarea no tiene repositorio asociado')

  const report = (original.ai_task_artifacts as { type: string; content: string | null; filename: string }[])
    ?.find(a => a.type === 'report')

  const { data, error } = await supabase.from('ai_tasks').insert({
    project_id:    original.project_id,
    repository_id: original.repository_id,
    type:          'apply_suggestions',
    level:         3,
    title:         `Aplicar fixes — ${TASK_TITLES[original.type] ?? original.type}`,
    status:        'queued',
    input_params:  {
      source_task_id: taskId,
      source_type:    original.type,
      report_content: report?.content?.slice(0, 10000) ?? null,
    },
    created_by: user?.id,
  }).select('id').single()

  if (error) throw new Error(error.message)
  revalidatePath('/ia', 'layout')
  redirect(`/ia/${data.id}`)
}

export async function retryTaskAction(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { data: original } = await supabase
    .from('ai_tasks')
    .select('type, project_id, repository_id, incident_id, level, title, input_params')
    .eq('id', taskId).single()

  if (!original) throw new Error('Tarea no encontrada')

  const { data, error } = await supabase.from('ai_tasks').insert({
    project_id:    original.project_id,
    repository_id: original.repository_id,
    incident_id:   original.incident_id,
    type:          original.type,
    level:         original.level,
    title:         original.title,
    status:        'queued',
    input_params:  original.input_params ?? {},
    created_by:    user?.id,
  }).select('id').single()

  if (error) throw new Error(error.message)
  revalidatePath('/ia', 'layout')
  redirect(`/ia/${data.id}`)
}

export async function cancelTaskAction(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  await supabase.from('ai_tasks').update({ status: 'cancelled' }).eq('id', taskId)
  revalidatePath('/ia', 'layout')
  redirect('/ia?toast=Tarea+cancelada')
}
