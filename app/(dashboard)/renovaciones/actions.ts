'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createRenewalAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('renewals').insert({
    client_id:    formData.get('client_id') as string,
    name:         formData.get('name') as string,
    type:         formData.get('type') as string,
    provider:     (formData.get('provider') as string) || null,
    renewal_date: formData.get('renewal_date') as string,
    cost:         (formData.get('cost') as string) ? Number(formData.get('cost')) : null,
    status:       formData.get('status') as string,
    notes:        (formData.get('notes') as string) || null,
    created_by:   user?.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/renovaciones')
  redirect('/renovaciones')
}

export async function updateRenewalAction(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('renewals').update({
    client_id:    formData.get('client_id') as string,
    name:         formData.get('name') as string,
    type:         formData.get('type') as string,
    provider:     (formData.get('provider') as string) || null,
    renewal_date: formData.get('renewal_date') as string,
    cost:         (formData.get('cost') as string) ? Number(formData.get('cost')) : null,
    status:       formData.get('status') as string,
    notes:        (formData.get('notes') as string) || null,
  }).eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/renovaciones')
  revalidatePath(`/renovaciones/${id}`)
  redirect(`/renovaciones/${id}`)
}

export async function deleteRenewalAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('renewals').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/renovaciones')
  redirect('/renovaciones')
}
