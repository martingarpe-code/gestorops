'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-6xl font-bold text-muted-foreground/20">500</p>
        <h1 className="text-xl font-semibold text-foreground">Algo salió mal</h1>
        <p className="text-sm text-muted-foreground">Se produjo un error inesperado. Inténtalo de nuevo.</p>
        {error.digest && <p className="text-xs text-muted-foreground font-mono">Código: {error.digest}</p>}
        <Button variant="outline" size="sm" onClick={reset}>Reintentar</Button>
      </div>
    </div>
  )
}
