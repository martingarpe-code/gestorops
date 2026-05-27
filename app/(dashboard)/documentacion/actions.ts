'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createDocAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const tagsRaw = (formData.get('tags') as string) || ''
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)

  const { data, error } = await supabase.from('documents').insert({
    client_id:  (formData.get('client_id') as string) || null,
    project_id: (formData.get('project_id') as string) || null,
    title:      formData.get('title') as string,
    content:    (formData.get('content') as string) || '',
    type:       formData.get('type') as string || 'note',
    tags,
    created_by: user?.id,
  }).select('id').single()

  if (error) throw new Error(error.message)
  revalidatePath('/documentacion', 'layout')
  redirect(`/documentacion/${data.id}`)
}

export async function updateDocAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const tagsRaw = (formData.get('tags') as string) || ''
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)

  const { error } = await supabase.from('documents').update({
    client_id:  (formData.get('client_id') as string) || null,
    project_id: (formData.get('project_id') as string) || null,
    title:      formData.get('title') as string,
    content:    (formData.get('content') as string) || '',
    type:       formData.get('type') as string,
    tags,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/documentacion', 'layout')
  revalidatePath(`/documentacion/${id}`)
  redirect(`/documentacion/${id}`)
}

export async function deleteDocAction(id: string) {
  const supabase = await createClient()
  await supabase.from('documents').delete().eq('id', id)
  revalidatePath('/documentacion', 'layout')
  redirect('/documentacion')
}
