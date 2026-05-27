import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ALLOWED_TABLES = ['clients', 'projects', 'incidents', 'renewals', 'maintenances', 'tasks'] as const
type AllowedTable = typeof ALLOWED_TABLES[number]

const TABLE_COLUMNS: Record<AllowedTable, string[]> = {
  clients:      ['name', 'company', 'sector', 'type', 'email', 'phone', 'website', 'created_at'],
  projects:     ['title', 'status', 'priority', 'start_date', 'estimated_end_date', 'budget', 'created_at'],
  incidents:    ['title', 'status', 'priority', 'hours_spent', 'opened_at', 'closed_at'],
  renewals:     ['name', 'type', 'provider', 'renewal_date', 'cost', 'status'],
  maintenances: ['name', 'type', 'billing_period', 'price', 'status', 'start_date'],
  tasks:        ['title', 'status', 'priority', 'due_date', 'created_at'],
}

function toCSV(rows: Record<string, unknown>[], columns: string[]): string {
  const header = columns.join(',')
  const lines = rows.map(row =>
    columns.map(col => {
      const val = row[col]
      if (val === null || val === undefined) return ''
      const str = String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }).join(',')
  )
  return [header, ...lines].join('\r\n')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params

  if (!ALLOWED_TABLES.includes(table as AllowedTable)) {
    return NextResponse.json({ error: 'Tabla no permitida' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const cols = TABLE_COLUMNS[table as AllowedTable]
  const { data, error } = await supabase.from(table).select(cols.join(', ')).order('created_at' in cols ? 'created_at' : cols[0], { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const csv = toCSV((data as unknown as Record<string, unknown>[]) ?? [], cols)
  const filename = `gestorops-${table}-${new Date().toISOString().split('T')[0]}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
