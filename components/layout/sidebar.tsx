import { SidebarHeader } from './sidebar-header'
import { SidebarNav } from './sidebar-nav'
import { SidebarFooter } from './sidebar-footer'

export function Sidebar() {
  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <SidebarHeader />
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
      <SidebarFooter />
    </aside>
  )
}
