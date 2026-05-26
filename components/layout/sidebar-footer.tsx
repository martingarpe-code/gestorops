import { createClient } from '@/lib/supabase/server'
import { signOutAction } from '@/app/(auth)/login/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export async function SidebarFooter() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="border-t border-sidebar-border px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded-full bg-secondary shrink-0 flex items-center justify-center">
          <span className="text-xs font-medium text-foreground">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate">
            {user?.email ?? '—'}
          </p>
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
