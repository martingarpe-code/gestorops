'use client'

import { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction, signUpAction } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STORAGE_KEY = 'gestorops_remembered_email'

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
  const emailRef = useRef<HTMLInputElement>(null)
  const [rememberedEmail, setRememberedEmail] = useState('')
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setRememberedEmail(saved)
      setRemember(true)
    }
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const email = emailRef.current?.value ?? ''
    if (remember && email) {
      localStorage.setItem(STORAGE_KEY, email)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            ref={emailRef}
            id="email" name="email" type="email"
            placeholder="tu@email.com" required autoComplete="email"
            defaultValue={rememberedEmail}
            key={rememberedEmail}
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

        {!isSignUp && (
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-primary"
            />
            <span className="text-xs text-muted-foreground">Recordar email</span>
          </label>
        )}

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
