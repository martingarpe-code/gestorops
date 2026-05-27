'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createIncidentAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('incidents').insert({
    client_id:   formData.get('client_id') as string,
    project_id:  (formData.get('project_id') as string) || null,
    title:       formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    priority:    formData.get('priority') as string,
    status:      'open',
    created_by:  user?.id,
    assigned_to: user?.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/incidencias')
  redirect('/incidencias')
}

export async function updateIncidentAction(id: string, formData: FormData) {
  const supabase = await createClient()
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
  revalidatePath('/incidencias')
  revalidatePath(`/incidencias/${id}`)
  redirect(`/incidencias/${id}`)
}

export async function deleteIncidentAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('incidents').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/incidencias')
  redirect('/incidencias')
}
