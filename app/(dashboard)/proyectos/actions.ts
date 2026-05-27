'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProjectAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const techStack = (formData.get('tech_stack') as string).split(',').map(s => s.trim()).filter(Boolean)

  const { data, error } = await supabase.from('projects').insert({
    client_id:          formData.get('client_id') as string,
    title:              formData.get('title') as string,
    description:        (formData.get('description') as string) || null,
    tech_stack:         techStack,
    status:             formData.get('status') as string,
    priority:           formData.get('priority') as string,
    start_date:         (formData.get('start_date') as string) || null,
    estimated_end_date: (formData.get('estimated_end_date') as string) || null,
    budget:             (formData.get('budget') as string) ? Number(formData.get('budget')) : null,
    notes:              (formData.get('notes') as string) || null,
    created_by:         user?.id,
  }).select('id').single()

  if (error) throw new Error(error.message)
  revalidatePath('/proyectos', 'layout')
  redirect(`/proyectos/${data.id}?toast=Proyecto+creado`)
}

export async function updateProjectAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const techStack = (formData.get('tech_stack') as string).split(',').map(s => s.trim()).filter(Boolean)

  const { error } = await supabase.from('projects').update({
    client_id:          formData.get('client_id') as string,
    title:              formData.get('title') as string,
    description:        (formData.get('description') as string) || null,
    tech_stack:         techStack,
    status:             formData.get('status') as string,
    priority:           formData.get('priority') as string,
    start_date:         (formData.get('start_date') as string) || null,
    estimated_end_date: (formData.get('estimated_end_date') as string) || null,
    actual_end_date:    (formData.get('actual_end_date') as string) || null,
    budget:             (formData.get('budget') as string) ? Number(formData.get('budget')) : null,
    notes:              (formData.get('notes') as string) || null,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/proyectos', 'layout')
  redirect(`/proyectos/${id}?toast=Proyecto+actualizado`)
}

export async function deleteProjectAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/proyectos', 'layout')
  redirect('/proyectos?toast=Proyecto+eliminado')
}
