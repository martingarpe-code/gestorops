import { createClient } from '@/lib/supabase/server'
import { SidebarHeader } from './sidebar-header'
import { SidebarNav } from './sidebar-nav'
import { SidebarFooter } from './sidebar-footer'
import { CommandPalette } from './command-palette'

async function getNavCounts() {
  try {
    const supabase = await createClient()
    const currentPeriod = (() => {
      const d = new Date()
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })()

    const [
      { count: incidents },
      { count: renewals },
      { data: maintenances },
      { data: entries },
      { count: tasks },
    ] = await Promise.all([
      supabase.from('incidents').select('*', { count: 'exact', head: true }).in('status', ['open', 'in_progress']),
      supabase.from('renewals').select('*', { count: 'exact', head: true }).eq('status', 'active').lte('renewal_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
      supabase.from('maintenances').select('id').eq('status', 'active'),
      supabase.from('maintenance_entries').select('maintenance_id').eq('period', currentPeriod).in('status', ['completed', 'invoiced', 'in_progress']),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).in('status', ['todo', 'in_progress']),
    ])

    const doneIds = new Set(entries?.map(e => e.maintenance_id) ?? [])
    const pendingMaint = (maintenances ?? []).filter(m => !doneIds.has(m.id)).length

    return {
      incidents: incidents ?? 0,
      renewals: renewals ?? 0,
      maintenances: pendingMaint,
      tasks: tasks ?? 0,
    }
  } catch {
    return {}
  }
}

export async function Sidebar() {
  const counts = await getNavCounts()

  return (
    <>
      <CommandPalette />
      <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <SidebarHeader />
        <div className="flex-1 overflow-y-auto">
          <SidebarNav counts={counts} />
        </div>
        <SidebarFooter />
      </aside>
    </>
  )
}
