'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXPORTS = [
  { table: 'clients',      label: 'Clientes'      },
  { table: 'projects',     label: 'Proyectos'     },
  { table: 'incidents',    label: 'Incidencias'   },
  { table: 'renewals',     label: 'Renovaciones'  },
  { table: 'maintenances', label: 'Mantenimientos'},
  { table: 'tasks',        label: 'Tareas'        },
]

export function ExportButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      {EXPORTS.map(({ table, label }) => (
        <Button
          key={table}
          variant="outline"
          size="sm"
          asChild
          className="gap-1.5"
        >
          <a href={`/api/export/${table}`} download>
            <Download className="h-3.5 w-3.5" />
            {label}
          </a>
        </Button>
      ))}
    </div>
  )
}
