// Server component that renders a <select> with all clients
import { createClient } from '@/lib/supabase/server'

export async function ClientSelect({ defaultValue }: { defaultValue?: string }) {
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('id, name').order('name')

  return (
    <select
      name="client_id"
      defaultValue={defaultValue ?? ''}
      required
      className="w-full h-8 rounded-lg border border-border bg-card px-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
    >
      <option value="" disabled>Selecciona un cliente</option>
      {clients?.map(c => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  )
}
