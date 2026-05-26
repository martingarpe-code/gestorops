export type UserRole = 'admin' | 'technician' | 'readonly'

export interface AppUser {
  id: string
  email: string
  role: UserRole
  createdAt: string
}

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

// Client status
export type ClientStatus = 'active' | 'inactive' | 'prospect'

// Project status
export type ProjectStatus = 'proposal' | 'active' | 'paused' | 'completed' | 'cancelled'

// Incident priority
export type IncidentPriority = 'critical' | 'high' | 'medium' | 'low'

// Incident status
export type IncidentStatus = 'open' | 'in_progress' | 'waiting_client' | 'resolved' | 'closed'
