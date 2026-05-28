'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function connectRepositoryAction(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const url = (formData.get('github_url') as string).trim().replace(/\/$/, '')
  // Parse owner/repo from URL: https://github.com/owner/repo
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error('URL de GitHub inválida')

  const [, owner, repo] = match
  const cleanRepo = repo.replace(/\.git$/, '')

  const { error } = await supabase.from('repositories').insert({
    project_id:    projectId,
    github_owner:  owner,
    github_repo:   cleanRepo,
    github_url:    `https://github.com/${owner}/${cleanRepo}`,
    default_branch:(formData.get('default_branch') as string) || 'main',
    created_by:    user?.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath(`/proyectos/${projectId}`, 'layout')
  redirect(`/proyectos/${projectId}?toast=Repositorio+conectado`)
}

export async function disconnectRepositoryAction(repoId: string, projectId: string) {
  const supabase = await createClient()
  await supabase.from('repositories').delete().eq('id', repoId)
  revalidatePath(`/proyectos/${projectId}`, 'layout')
  redirect(`/proyectos/${projectId}?toast=Repositorio+desconectado`)
}
