export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pushupers: {
        Row: {
          id: number
          created_at: string | null
          email: string
          firstname: string | null
          lastname: string | null
          avatar: string | null
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string | null
          email: string
          firstname?: string | null
          lastname?: string | null
          avatar?: string | null
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string | null
          email?: string
          firstname?: string | null
          lastname?: string | null
          avatar?: string | null
          user_id?: string
        }
      }
      workouts: {
        Row: {
          id: number
          created_at: string | null
          date: string
          user_id: string
          repetitions: number
        }
        Insert: {
          id?: number
          created_at?: string | null
          date: string
          user_id: string
          repetitions?: number
        }
        Update: {
          id?: number
          created_at?: string | null
          date?: string
          user_id?: string
          repetitions?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
