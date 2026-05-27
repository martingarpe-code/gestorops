import { Suspense } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { ToastHandler } from '@/components/shared/toast-handler'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
      <Suspense fallback={null}>
        <ToastHandler />
      </Suspense>
    </div>
  )
}
