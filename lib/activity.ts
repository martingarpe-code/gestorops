import type { SupabaseClient } from '@supabase/supabase-js'

type ActivityPayload = {
  entity_type: string
  entity_id?: string
  action: string
  description?: string
  metadata?: Record<string, unknown>
  performed_by?: string
}

export async function logActivity(supabase: SupabaseClient, payload: ActivityPayload) {
  try {
    await supabase.from('activity_log').insert(payload)
  } catch {
    // Non-blocking — never fail the main action due to logging
  }
}
