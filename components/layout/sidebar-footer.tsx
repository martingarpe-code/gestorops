import { createClient } from '@/lib/supabase/server'
import { signOutAction } from '@/app/(auth)/login/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export async function SidebarFooter() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const displayName = user?.email?.split('@')[0] ?? 'Usuario'
  const initial = displayName[0]?.toUpperCase() ?? 'U'

  return (
    <div className="border-t border-sidebar-border px-3 py-3">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shrink-0 flex items-center justify-center shadow-sm">
          <span className="text-xs font-bold text-white leading-none select-none">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate capitalize">{displayName}</p>
          <p className="text-[10px] text-muted-foreground/70 truncate">{user?.email}</p>
        </div>
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
