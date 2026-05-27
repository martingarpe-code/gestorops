'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createDocAction, updateDocAction } from '@/app/(dashboard)/documentacion/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MarkdownRenderer } from './markdown-renderer'
import type { Tables } from '@/types/database'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending}>{pending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear documento'}</Button>
}

export function DocEditor({ doc, clients, projects, defaultClientId, defaultProjectId }: {
  doc?: Tables<'documents'>
  clients: { id: string; name: string }[]
  projects: { id: string; title: string }[]
  defaultClientId?: string
  defaultProjectId?: string
}) {
  const isEdit = !!doc
  const action = isEdit ? updateDocAction.bind(null, doc.id) : createDocAction
  const [content, setContent] = useState(doc?.content ?? '')
  const [preview, setPreview] = useState(false)

  return (
    <form action={action} className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-sm font-medium text-foreground">Título *</label>
            <Input name="title" defaultValue={doc?.title} required placeholder="Título del documento" className="bg-background border-border text-base font-medium" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Tipo</label>
            <select name="type" defaultValue={doc?.type ?? 'note'} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="note">Nota</option>
              <option value="manual">Manual</option>
              <option value="procedure">Procedimiento</option>
              <option value="meeting">Reunión</option>
              <option value="decision">Decisión</option>
              <option value="custom">Otro</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Tags</label>
            <Input name="tags" defaultValue={doc?.tags?.join(', ') ?? ''} placeholder="deploy, staging, api (separados por coma)" className="bg-background border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Cliente</label>
            <select name="client_id" defaultValue={doc?.client_id ?? defaultClientId ?? ''} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="">Sin cliente</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Proyecto</label>
            <select name="project_id" defaultValue={doc?.project_id ?? defaultProjectId ?? ''} className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
              <option value="">Sin proyecto</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
          <span className="text-xs text-muted-foreground">Markdown soportado</span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPreview(false)}
              className={`text-xs px-2 py-1 rounded transition-colors ${!preview ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              Editar
            </button>
            <button type="button" onClick={() => setPreview(true)}
              className={`text-xs px-2 py-1 rounded transition-colors ${preview ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              Preview
            </button>
          </div>
        </div>
        <input type="hidden" name="content" value={content} />
        {preview ? (
          <div className="p-5 min-h-64">
            {content ? <MarkdownRenderer content={content} /> : <p className="text-sm text-muted-foreground">Sin contenido todavía</p>}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={18}
            placeholder={`# Título\n\nEscribe aquí en Markdown...\n\n## Sección\n\nContenido de la sección.`}
            className="w-full bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none font-mono leading-relaxed"
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
        <Button type="button" variant="outline" onClick={() => history.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
