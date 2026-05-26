import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { pathname } = request.nextUrl

  // En desarrollo sin Supabase configurado, permitir acceso libre al dashboard
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const isSupabaseConfigured =
    supabaseUrl.length > 0 && !supabaseUrl.includes('placeholder')

  if (isSupabaseConfigured) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (
      !user &&
      !pathname.startsWith('/login') &&
      !pathname.startsWith('/auth')
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
