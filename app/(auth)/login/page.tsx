import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginForm } from './login-form'

export const metadata = { title: 'Acceder' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-md bg-primary" />
            <span className="text-xl font-semibold tracking-tight text-foreground">
              GestorOps
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Acceder al panel
          </h1>
          <p className="text-sm text-muted-foreground">
            Introduce tus credenciales para continuar
          </p>
        </div>

        {/* Error message */}
        {error === 'invalid_credentials' && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Email o contraseña incorrectos. Inténtalo de nuevo.
          </div>
        )}
        {error === 'auth_callback_failed' && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Error de autenticación. Inténtalo de nuevo.
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  )
}
