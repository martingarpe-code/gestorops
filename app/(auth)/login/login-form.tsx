'use client'

import { useFormStatus } from 'react-dom'
import { loginAction, signUpAction } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Un momento...' : label}
    </Button>
  )
}

export function LoginForm({ isSignUp }: { isSignUp: boolean }) {
  const action = isSignUp ? signUpAction : loginAction

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            id="email" name="email" type="email"
            placeholder="tu@email.com" required autoComplete="email"
            className="bg-card border-border"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Contraseña
          </label>
          <Input
            id="password" name="password" type="password"
            placeholder="••••••••" required
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className="bg-card border-border"
          />
        </div>
        <SubmitButton label={isSignUp ? 'Crear cuenta' : 'Acceder'} />
      </form>

      <div className="text-center">
        <a
          href={isSignUp ? '/login' : '/login?mode=signup'}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignUp ? '¿Ya tienes cuenta? Acceder' : 'Primera vez aquí · Crear cuenta'}
        </a>
      </div>
    </div>
  )
}
