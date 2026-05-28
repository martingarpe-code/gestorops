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
  custom:               'Tarea personalizada',
}

const TASK_LEVELS: Record<string, number> = {
  analyze: 1, security_review: 1, onboarding: 1,
  maintenance_monthly: 2, generate_docs: 2,
  debug_incident: 2, update_dependencies: 3, custom: 2,
}

export async function createAITaskAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const type = formData.get('type') as string
  const projectId = formData.get('project_id') as string
  const repoId = (formData.get('repository_id') as string) || null
  const incidentId = (formData.get('incident_id') as string) || null
  const customInstructions = (formData.get('custom_instructions') as string) || null

  const { data, error } = await supabase.from('ai_tasks').insert({
    project_id:    projectId,
    repository_id: repoId,
    incident_id:   incidentId,
    type,
    level:         TASK_LEVELS[type] ?? 1,
    title:         TASK_TITLES[type] ?? 'Tarea IA',
    status:        'queued',
    input_params:  customInstructions ? { custom_instructions: customInstructions } : {},
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

export async function cancelTaskAction(taskId: string) {
  const supabase = await createClient()
  await supabase.from('ai_tasks').update({ status: 'cancelled' }).eq('id', taskId)
  revalidatePath('/ia', 'layout')
  redirect('/ia?toast=Tarea+cancelada')
}
