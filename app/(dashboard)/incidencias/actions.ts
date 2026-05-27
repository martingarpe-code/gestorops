'use server'

import { createClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/activity'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createIncidentAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const title = formData.get('title') as string

  const { data, error } = await supabase.from('incidents').insert({
    client_id:   formData.get('client_id') as string,
    project_id:  (formData.get('project_id') as string) || null,
    title,
    description: (formData.get('description') as string) || null,
    priority:    formData.get('priority') as string,
    status:      'open',
    created_by:  user?.id,
    assigned_to: user?.id,
  }).select('id').single()

  if (error) throw new Error(error.message)
  await logActivity(supabase, { entity_type: 'incident', entity_id: data.id, action: 'created', description: `Incidencia creada: ${title}`, performed_by: user?.id })
  revalidatePath('/incidencias', 'layout')
  redirect(`/incidencias/${data.id}?toast=Incidencia+creada`)
}

export async function updateIncidentAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const status = formData.get('status') as string

  const { error } = await supabase.from('incidents').update({
    client_id:        formData.get('client_id') as string,
    project_id:       (formData.get('project_id') as string) || null,
    title:            formData.get('title') as string,
    description:      (formData.get('description') as string) || null,
    priority:         formData.get('priority') as string,
    status,
    resolution_notes: (formData.get('resolution_notes') as string) || null,
    hours_spent:      (formData.get('hours_spent') as string) ? Number(formData.get('hours_spent')) : null,
    closed_at:        ['resolved', 'closed'].includes(status) ? new Date().toISOString() : null,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  await logActivity(supabase, { entity_type: 'incident', entity_id: id, action: 'updated', description: `Estado: ${status}`, performed_by: user?.id })
  revalidatePath('/incidencias', 'layout')
  redirect(`/incidencias/${id}?toast=Incidencia+actualizada`)
}

export async function deleteIncidentAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('incidents').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/incidencias', 'layout')
  redirect('/incidencias?toast=Incidencia+eliminada')
}
