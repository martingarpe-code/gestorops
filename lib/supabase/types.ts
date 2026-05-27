// Helper to safely cast Supabase joined relations (can come as object or array)
export function asRelation<T>(val: unknown): T | null {
  if (!val) return null
  if (Array.isArray(val)) return (val[0] as T) ?? null
  return val as T
}
