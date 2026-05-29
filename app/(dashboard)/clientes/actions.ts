'use server'

import { createClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/activity'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  const name = formData.get('name') as string

  const { data, error } = await supabase.from('clients').insert({
    name,
    company:    (formData.get('company') as string) || null,
    sector:     (formData.get('sector') as string) || null,
    type:       formData.get('type') as string,
    email:      (formData.get('email') as string) || null,
    phone:      (formData.get('phone') as string) || null,
    website:    (formData.get('website') as string) || null,
    notes:      (formData.get('notes') as string) || null,
    created_by: user?.id,
  }).select('id').single()

  if (error) throw new Error(error.message)
  await logActivity(supabase, { entity_type: 'client', entity_id: data.id, action: 'created', description: `Cliente creado: ${name}`, performed_by: user?.id })
  revalidatePath('/clientes', 'layout')
  redirect(`/clientes/${data.id}?toast=${encodeURIComponent(`Cliente "${name}" creado`)}`)
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  const name = formData.get('name') as string

  const { error } = await supabase.from('clients').update({
    name,
    company: (formData.get('company') as string) || null,
    sector:  (formData.get('sector') as string) || null,
    type:    formData.get('type') as string,
    email:   (formData.get('email') as string) || null,
    phone:   (formData.get('phone') as string) || null,
    website: (formData.get('website') as string) || null,
    notes:   (formData.get('notes') as string) || null,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  await logActivity(supabase, { entity_type: 'client', entity_id: id, action: 'updated', description: `Cliente actualizado: ${name}`, performed_by: user?.id })
  revalidatePath('/clientes', 'layout')
  redirect(`/clientes/${id}?toast=Cambios+guardados`)
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw new Error(error.message)
  await logActivity(supabase, { entity_type: 'client', entity_id: id, action: 'deleted', performed_by: user?.id })
  revalidatePath('/clientes', 'layout')
  redirect('/clientes?toast=Cliente+eliminado')
}
