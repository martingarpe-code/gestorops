'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  LayoutDashboard, Users, FolderKanban, Wrench, AlertCircle,
  KeyRound, RefreshCcw, FileText, Server, CheckSquare, BarChart2,
  Settings, Plus, Search,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type SearchResult = { id: string; label: string; sub?: string; href: string; icon: React.ComponentType<{ className?: string }> }

const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/dashboard',       icon: LayoutDashboard },
  { label: 'Clientes',        href: '/clientes',        icon: Users },
  { label: 'Proyectos',       href: '/proyectos',       icon: FolderKanban },
  { label: 'Mantenimientos',  href: '/mantenimientos',  icon: Wrench },
  { label: 'Incidencias',     href: '/incidencias',     icon: AlertCircle },
  { label: 'Accesos',         href: '/accesos',         icon: KeyRound },
  { label: 'Renovaciones',    href: '/renovaciones',    icon: RefreshCcw },
  { label: 'Documentación',   href: '/documentacion',   icon: FileText },
  { label: 'Infraestructura', href: '/infraestructura', icon: Server },
  { label: 'Tareas',          href: '/tareas',          icon: CheckSquare },
  { label: 'Analítica',       href: '/analitica',       icon: BarChart2 },
  { label: 'Configuración',   href: '/configuracion',   icon: Settings },
]

const CREATE_ITEMS = [
  { label: 'Nuevo cliente',     href: '/clientes/nuevo',     icon: Users },
  { label: 'Nuevo proyecto',    href: '/proyectos/nuevo',    icon: FolderKanban },
  { label: 'Nueva incidencia',  href: '/incidencias/nuevo',  icon: AlertCircle },
  { label: 'Nueva renovación',  href: '/renovaciones/nuevo', icon: RefreshCcw },
  { label: 'Nuevo acceso',      href: '/accesos/nuevo',      icon: KeyRound },
  { label: 'Nueva tarea',       href: '/tareas/nuevo',       icon: CheckSquare },
  { label: 'Nuevo documento',   href: '/documentacion/nuevo',icon: FileText },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return }
    setLoading(true)
    const supabase = createClient()
    const term = `%${q}%`

    const [{ data: clients }, { data: projects }, { data: incidents }, { data: docs }] = await Promise.all([
      supabase.from('clients').select('id, name, company').ilike('name', term).limit(4),
      supabase.from('projects').select('id, title').ilike('title', term).limit(4),
      supabase.from('incidents').select('id, title').ilike('title', term).limit(4),
      supabase.from('documents').select('id, title').ilike('title', term).limit(3),
    ])

    const found: SearchResult[] = [
      ...(clients ?? []).map(c => ({ id: c.id, label: c.name, sub: c.company ?? 'Cliente', href: `/clientes/${c.id}`, icon: Users })),
      ...(projects ?? []).map(p => ({ id: p.id, label: p.title, sub: 'Proyecto', href: `/proyectos/${p.id}`, icon: FolderKanban })),
      ...(incidents ?? []).map(i => ({ id: i.id, label: i.title, sub: 'Incidencia', href: `/incidencias/${i.id}`, icon: AlertCircle })),
      ...(docs ?? []).map(d => ({ id: d.id, label: d.title, sub: 'Documento', href: `/documentacion/${d.id}`, icon: FileText })),
    ]
    setResults(found)
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(query), 150)
    return () => clearTimeout(t)
  }, [query, search])

  function navigate(href: string) {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <Command className="relative w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden" shouldFilter={false}>
        <div className="flex items-center gap-2 px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Buscar clientes, proyectos, incidencias…"
            className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
          <kbd className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Esc</kbd>
        </div>
        <Command.List className="max-h-80 overflow-y-auto py-2">
          {loading && <Command.Loading><p className="text-xs text-muted-foreground text-center py-3">Buscando…</p></Command.Loading>}

          {query.length >= 2 && results.length > 0 && (
            <Command.Group heading={<span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resultados</span>}>
              {results.map(r => (
                <Command.Item key={r.id} value={r.href} onSelect={() => navigate(r.href)}
                  className="flex items-center gap-3 px-3 py-2 mx-1 rounded-md cursor-pointer hover:bg-secondary data-[selected=true]:bg-secondary transition-colors">
                  <r.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{r.label}</p>
                    {r.sub && <p className="text-xs text-muted-foreground">{r.sub}</p>}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {query.length >= 2 && !loading && results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">Sin resultados para &ldquo;{query}&rdquo;</p>
          )}

          {query.length < 2 && (
            <>
              <Command.Group heading={<span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Crear nuevo</span>}>
                {CREATE_ITEMS.map(item => (
                  <Command.Item key={item.href} value={item.href} onSelect={() => navigate(item.href)}
                    className="flex items-center gap-3 px-3 py-2 mx-1 rounded-md cursor-pointer hover:bg-secondary data-[selected=true]:bg-secondary transition-colors">
                    <Plus className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Group heading={<span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navegar</span>}>
                {NAV_ITEMS.map(item => (
                  <Command.Item key={item.href} value={item.href} onSelect={() => navigate(item.href)}
                    className="flex items-center gap-3 px-3 py-2 mx-1 rounded-md cursor-pointer hover:bg-secondary data-[selected=true]:bg-secondary transition-colors">
                    <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            </>
          )}
        </Command.List>
      </Command>
    </div>
  )
}
