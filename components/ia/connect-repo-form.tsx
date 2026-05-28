'use client'

import { useFormStatus } from 'react-dom'
import { connectRepositoryAction } from '@/app/(dashboard)/proyectos/[id]/repositorios/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function SubmitButton() {
  const { pending } = useFormStatus()
  return <Button type="submit" size="sm" disabled={pending}>{pending ? 'Conectando…' : 'Conectar'}</Button>
}

export function ConnectRepoForm({ projectId }: { projectId: string }) {
  const action = connectRepositoryAction.bind(null, projectId)

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-foreground">URL del repositorio GitHub *</label>
        <Input name="github_url" placeholder="https://github.com/owner/repo" required className="bg-background border-border text-sm" />
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-foreground">Rama por defecto</label>
        <Input name="default_branch" defaultValue="main" className="bg-background border-border text-sm w-32" />
      </div>
      <SubmitButton />
    </form>
  )
}
