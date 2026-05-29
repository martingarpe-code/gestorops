'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTaskAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { error } = await supabase.from('tasks').insert({
    client_id:   (formData.get('client_id') as string) || null,
    project_id:  (formData.get('project_id') as string) || null,
    title:       formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    status:      formData.get('status') as string || 'todo',
    priority:    formData.get('priority') as string || 'medium',
    due_date:    (formData.get('due_date') as string) || null,
    assigned_to: user?.id,
    created_by:  user?.id,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/tareas', 'layout')
  redirect('/tareas')
}

export async function updateTaskStatusAction(id: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/tareas', 'layout')
}

export async function updateTaskAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('tasks').update({
    client_id:   (formData.get('client_id') as string) || null,
    project_id:  (formData.get('project_id') as string) || null,
    title:       formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    status:      formData.get('status') as string,
    priority:    formData.get('priority') as string,
    due_date:    (formData.get('due_date') as string) || null,
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/tareas', 'layout')
  redirect('/tareas')
}

export async function deleteTaskAction(id: string) {
  const supabase = await createClient()
  await supabase.from('tasks').delete().eq('id', id)
  revalidatePath('/tareas', 'layout')
  redirect('/tareas')
}
