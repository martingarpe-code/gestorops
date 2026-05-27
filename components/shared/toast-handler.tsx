'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { toast } from 'sonner'

// Reads ?toast=message&type=success|error from URL, shows it, then cleans the URL
export function ToastHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const message = searchParams.get('toast')
    const type = searchParams.get('type') ?? 'success'
    if (!message) return

    const decoded = decodeURIComponent(message)
    if (type === 'error') {
      toast.error(decoded)
    } else {
      toast.success(decoded)
    }

    // Clean the URL without triggering a navigation
    const params = new URLSearchParams(searchParams.toString())
    params.delete('toast')
    params.delete('type')
    const newUrl = params.size > 0 ? `${pathname}?${params}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [searchParams, router, pathname])

  return null
}
