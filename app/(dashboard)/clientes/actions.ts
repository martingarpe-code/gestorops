'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('clients').insert({
    name:     formData.get('name') as string,
    company:  (formData.get('company') as string) || null,
    sector:   (formData.get('sector') as string) || null,
    type:     formData.get('type') as string,
    email:    (formData.get('email') as string) || null,
    phone:    (formData.get('phone') as string) || null,
    website:  (formData.get('website') as string) || null,
    notes:    (formData.get('notes') as string) || null,
    created_by: user?.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/clientes')
  redirect('/clientes')
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('clients').update({
    name:    formData.get('name') as string,
    company: (formData.get('company') as string) || null,
    sector:  (formData.get('sector') as string) || null,
    type:    formData.get('type') as string,
    email:   (formData.get('email') as string) || null,
    phone:   (formData.get('phone') as string) || null,
    website: (formData.get('website') as string) || null,
    notes:   (formData.get('notes') as string) || null,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/clientes')
  revalidatePath(`/clientes/${id}`)
  redirect(`/clientes/${id}`)
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/clientes')
  redirect('/clientes')
}
