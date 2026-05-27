'use server'

import { createClient } from '@/lib/supabase/server'
import { encrypt, decrypt } from '@/lib/crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createAccessAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [usernameEnc, passwordEnc, notesEnc] = await Promise.all([
    encrypt(formData.get('username') as string),
    encrypt(formData.get('password') as string),
    encrypt(formData.get('notes') as string),
  ])

  const { error } = await supabase.from('technical_accesses').insert({
    client_id:          formData.get('client_id') as string,
    type:               formData.get('type') as string,
    name:               formData.get('name') as string,
    url:                (formData.get('url') as string) || null,
    username_encrypted: usernameEnc || null,
    password_encrypted: passwordEnc || null,
    notes_encrypted:    notesEnc || null,
    status:             'active',
    created_by:         user?.id,
  })

  if (error) throw new Error(error.message)

  await supabase.from('access_log').insert({ access_id: (await supabase.from('technical_accesses').select('id').order('created_at', { ascending: false }).limit(1).single()).data?.id, action: 'created', performed_by: user?.id })

  revalidatePath('/accesos')
  redirect('/accesos')
}

export async function updateAccessAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const rawUsername = formData.get('username') as string
  const rawPassword = formData.get('password') as string
  const rawNotes    = formData.get('notes') as string

  const [usernameEnc, passwordEnc, notesEnc] = await Promise.all([
    rawUsername ? encrypt(rawUsername) : Promise.resolve(undefined),
    rawPassword ? encrypt(rawPassword) : Promise.resolve(undefined),
    encrypt(rawNotes),
  ])

  const update: Record<string, unknown> = {
    type:   formData.get('type') as string,
    name:   formData.get('name') as string,
    url:    (formData.get('url') as string) || null,
    status: formData.get('status') as string,
    notes_encrypted: notesEnc || null,
  }
  if (usernameEnc !== undefined) update.username_encrypted = usernameEnc
  if (passwordEnc !== undefined) update.password_encrypted = passwordEnc

  const { error } = await supabase.from('technical_accesses').update(update).eq('id', id)
  if (error) throw new Error(error.message)

  await supabase.from('access_log').insert({ access_id: id, action: 'edited', performed_by: user?.id })

  revalidatePath('/accesos')
  revalidatePath(`/accesos/${id}`)
  redirect(`/accesos/${id}`)
}

export async function deleteAccessAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('technical_accesses').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/accesos')
  redirect('/accesos')
}

// Server Action to decrypt and return a single field — never stored decrypted
export async function revealFieldAction(id: string, field: 'username' | 'password' | 'notes'): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const col = `${field}_encrypted`
  const { data } = await supabase.from('technical_accesses').select(col).eq('id', id).single()
  if (!data) return ''

  const encrypted = (data as unknown as Record<string, string | null>)[col]
  if (!encrypted) return ''

  const plain = await decrypt(encrypted)

  await supabase.from('access_log').insert({ access_id: id, action: 'viewed', performed_by: user?.id })

  return plain
}
