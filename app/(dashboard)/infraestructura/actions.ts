'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createInfraAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('infrastructure_items').insert({
    client_id:   formData.get('client_id') as string,
    category:    formData.get('category') as string,
    name:        formData.get('name') as string,
    provider:    (formData.get('provider') as string) || null,
    url:         (formData.get('url') as string) || null,
    description: (formData.get('description') as string) || null,
    status:      formData.get('status') as string || 'active',
    created_by:  user?.id,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/infraestructura', 'layout')
  redirect('/infraestructura')
}

export async function updateInfraAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('infrastructure_items').update({
    client_id:   formData.get('client_id') as string,
    category:    formData.get('category') as string,
    name:        formData.get('name') as string,
    provider:    (formData.get('provider') as string) || null,
    url:         (formData.get('url') as string) || null,
    description: (formData.get('description') as string) || null,
    status:      formData.get('status') as string,
  }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/infraestructura', 'layout')
  redirect('/infraestructura')
}

export async function deleteInfraAction(id: string) {
  const supabase = await createClient()
  await supabase.from('infrastructure_items').delete().eq('id', id)
  revalidatePath('/infraestructura', 'layout')
  redirect('/infraestructura')
}
