export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      access_log: {
        Row: {
          access_id: string
          action: string
          created_at: string
          id: string
          performed_by: string | null
        }
        Insert: {
          access_id: string
          action: string
          created_at?: string
          id?: string
          performed_by?: string | null
        }
        Update: {
          access_id?: string
          action?: string
          created_at?: string
          id?: string
          performed_by?: string | null
        }
      }
      activity_log: {
        Row: {
          action: string
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          performed_by: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
        }
      }
      clients: {
        Row: {
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          sector: string | null
          tags: string[] | null
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          sector?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          sector?: string | null
          tags?: string[] | null
          type?: string
          updated_at?: string
          website?: string | null
        }
      }
      documents: {
        Row: {
          client_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          id: string
          project_id: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
      }
      incidents: {
        Row: {
          assigned_to: string | null
          client_id: string
          closed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          hours_spent: number | null
          id: string
          opened_at: string
          priority: string
          project_id: string | null
          resolution_notes: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id: string
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          hours_spent?: number | null
          id?: string
          opened_at?: string
          priority?: string
          project_id?: string | null
          resolution_notes?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          hours_spent?: number | null
          id?: string
          opened_at?: string
          priority?: string
          project_id?: string | null
          resolution_notes?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
      }
      infrastructure_items: {
        Row: {
          category: string
          client_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          name: string
          provider: string | null
          status: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category: string
          client_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          provider?: string | null
          status?: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string
          client_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          provider?: string | null
          status?: string
          updated_at?: string
          url?: string | null
        }
      }
      maintenance_entries: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string
          hours_spent: number | null
          id: string
          maintenance_id: string
          period: string
          status: string
          work_done: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          hours_spent?: number | null
          id?: string
          maintenance_id: string
          period: string
          status?: string
          work_done?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          hours_spent?: number | null
          id?: string
          maintenance_id?: string
          period?: string
          status?: string
          work_done?: string | null
        }
      }
      maintenances: {
        Row: {
          billing_period: string
          client_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          price: number | null
          start_date: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          billing_period?: string
          client_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          price?: number | null
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          billing_period?: string
          client_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          actual_end_date: string | null
          budget: number | null
          client_id: string
          created_at: string
          created_by: string | null
          description: string | null
          estimated_end_date: string | null
          id: string
          notes: string | null
          priority: string
          start_date: string | null
          status: string
          tags: string[] | null
          tech_stack: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          budget?: number | null
          client_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_end_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          start_date?: string | null
          status?: string
          tags?: string[] | null
          tech_stack?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          budget?: number | null
          client_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_end_date?: string | null
          id?: string
          notes?: string | null
          priority?: string
          start_date?: string | null
          status?: string
          tags?: string[] | null
          tech_stack?: Json | null
          title?: string
          updated_at?: string
        }
      }
      renewals: {
        Row: {
          client_id: string
          cost: number | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          notes: string | null
          notify_days: number[] | null
          provider: string | null
          renewal_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          cost?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          notes?: string | null
          notify_days?: number[] | null
          provider?: string | null
          renewal_date: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          cost?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          notes?: string | null
          notify_days?: number[] | null
          provider?: string | null
          renewal_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
      }
      technical_accesses: {
        Row: {
          client_id: string
          created_at: string
          created_by: string | null
          id: string
          last_verified_at: string | null
          name: string
          notes_encrypted: string | null
          password_encrypted: string | null
          status: string
          type: string
          updated_at: string
          url: string | null
          username_encrypted: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          last_verified_at?: string | null
          name: string
          notes_encrypted?: string | null
          password_encrypted?: string | null
          status?: string
          type: string
          updated_at?: string
          url?: string | null
          username_encrypted?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          last_verified_at?: string | null
          name?: string
          notes_encrypted?: string | null
          password_encrypted?: string | null
          status?: string
          type?: string
          updated_at?: string
          url?: string | null
          username_encrypted?: string | null
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
