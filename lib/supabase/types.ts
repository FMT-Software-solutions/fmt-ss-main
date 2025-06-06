export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
          updated_at: string;
          status: 'pending' | 'sent' | 'failed';
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
          updated_at?: string;
          status?: 'pending' | 'sent' | 'failed';
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
          updated_at?: string;
          status?: 'pending' | 'sent' | 'failed';
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribedAt: string;
          unsubscribeToken: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          subscribedAt?: string;
          unsubscribeToken: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          subscribedAt?: string;
          unsubscribeToken?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      training_registrations: {
        Row: {
          id: string;
          training_id: string;
          training_slug: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          company: string | null;
          message: string | null;
          status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          training_id: string;
          training_slug: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          message?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'attended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          training_id?: string;
          training_slug?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          message?: string | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'attended';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
