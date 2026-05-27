'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/login?error=invalid_credentials')
  }

  redirect('/dashboard')
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    const msg = encodeURIComponent(error.message)
    redirect(`/login?mode=signup&error=signup_failed&msg=${msg}`)
  }

  redirect('/dashboard')
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
