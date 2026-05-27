'use client'

import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { createAccessAction, updateAccessAction } from '@/app/(dashboard)/accesos/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Cifrando y guardando...' : isEdit ? 'Guardar cambios' : 'Guardar acceso'}</Button>
}

type AccessData = { id: string; client_id: string; type: string; name: string; url: string | null; status: string }

export function AccessForm({ access, clients, defaultClientId }: {
  access?: AccessData
  clients: { id: string; name: string }[]
  defaultClientId?: string
}) {
  const router = useRouter()
  const isEdit = !!access
  const action = isEdit ? updateAccessAction.bind(null, access.id) : createAccessAction

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Cliente *</label>
          <select name="client_id" defaultValue={access?.client_id ?? defaultClientId ?? ''} required className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option value="" disabled>Selecciona un cliente</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Tipo *</label>
            <select name="type" defaultValue={access?.type ?? 'hosting'} required className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="hosting">Hosting</option>
              <option value="database">Base de datos</option>
              <option value="platform">Plataforma</option>
              <option value="api">API / Token</option>
              <option value="domain">Dominio</option>
              <option value="email">Email</option>
              <option value="ssh">SSH</option>
              <option value="custom">Otro</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Estado</label>
            <select name="status" defaultValue={access?.status ?? 'active'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="active">Activo</option>
              <option value="expired">Expirado</option>
              <option value="unknown">Desconocido</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Nombre descriptivo *</label>
          <Input name="name" defaultValue={access?.name} required placeholder="ej: cPanel empresa.com" className="bg-background border-border" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">URL / Endpoint</label>
          <Input name="url" type="url" defaultValue={access?.url ?? ''} placeholder="https://…" className="bg-background border-border" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Credenciales</h2>
          <span className="text-xs text-muted-foreground">Cifrado AES-256-GCM</span>
        </div>
        {isEdit && <p className="text-xs text-muted-foreground">Deja en blanco para mantener los valores actuales.</p>}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Usuario / Email</label>
          <Input name="username" placeholder={isEdit ? '(sin cambios)' : 'usuario@ejemplo.com'} autoComplete="off" className="bg-background border-border font-mono" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Contraseña / Token</label>
          <Input name="password" type="password" placeholder={isEdit ? '(sin cambios)' : '••••••••'} autoComplete="new-password" className="bg-background border-border font-mono" />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Notas adicionales</label>
          <textarea name="notes" rows={2} placeholder="Información adicional (también cifrada)…" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
