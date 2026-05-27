import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-4">
        <p className="text-6xl font-bold text-muted-foreground/20 tabular-nums">404</p>
        <h1 className="text-xl font-semibold text-foreground">Página no encontrada</h1>
        <p className="text-sm text-muted-foreground">El recurso que buscas no existe o fue eliminado.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">Volver al dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
