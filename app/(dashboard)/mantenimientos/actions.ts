'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMaintenanceAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { error } = await supabase.from('maintenances').insert({
    client_id:      formData.get('client_id') as string,
    name:           formData.get('name') as string,
    description:    (formData.get('description') as string) || null,
    type:           formData.get('type') as string,
    price:          (formData.get('price') as string) ? Number(formData.get('price')) : null,
    billing_period: formData.get('billing_period') as string,
    status:         formData.get('status') as string,
    start_date:     (formData.get('start_date') as string) || null,
    created_by:     user?.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/mantenimientos', 'layout')
  redirect('/mantenimientos')
}

export async function updateMaintenanceAction(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('maintenances').update({
    client_id:      formData.get('client_id') as string,
    name:           formData.get('name') as string,
    description:    (formData.get('description') as string) || null,
    type:           formData.get('type') as string,
    price:          (formData.get('price') as string) ? Number(formData.get('price')) : null,
    billing_period: formData.get('billing_period') as string,
    status:         formData.get('status') as string,
    start_date:     (formData.get('start_date') as string) || null,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/mantenimientos', 'layout')
  revalidatePath(`/mantenimientos/${id}`)
  redirect(`/mantenimientos/${id}`)
}

export async function deleteMaintenanceAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('maintenances').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/mantenimientos', 'layout')
  redirect('/mantenimientos')
}

export async function upsertEntryAction(maintenanceId: string, period: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  const status = formData.get('status') as string

  const { data: existing } = await supabase
    .from('maintenance_entries')
    .select('id')
    .eq('maintenance_id', maintenanceId)
    .eq('period', period)
    .single()

  const payload = {
    maintenance_id: maintenanceId,
    period,
    status,
    work_done:    (formData.get('work_done') as string) || null,
    hours_spent:  (formData.get('hours_spent') as string) ? Number(formData.get('hours_spent')) : null,
    completed_at: status === 'completed' || status === 'invoiced' ? new Date().toISOString() : null,
    completed_by: status === 'completed' || status === 'invoiced' ? user?.id : null,
  }

  if (existing) {
    await supabase.from('maintenance_entries').update(payload).eq('id', existing.id)
  } else {
    await supabase.from('maintenance_entries').insert(payload)
  }

  revalidatePath(`/mantenimientos/${maintenanceId}`)
  redirect(`/mantenimientos/${maintenanceId}`)
}
