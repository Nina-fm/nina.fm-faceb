export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName: string
          query: string
          variables: Json
          extensions: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      authors: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: number
          name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
      }
      mixtapes: {
        Row: {
          authors_text: string | null
          comment: string | null
          cover: string | null
          created_at: string | null
          id: number
          name: string
          tracks_text: string | null
          updated_at: string | null
          year: string | null
        }
        Insert: {
          authors_text?: string | null
          comment?: string | null
          cover?: string | null
          created_at?: string | null
          id?: number
          name: string
          tracks_text?: string | null
          updated_at?: string | null
          year?: string | null
        }
        Update: {
          authors_text?: string | null
          comment?: string | null
          cover?: string | null
          created_at?: string | null
          id?: number
          name?: string
          tracks_text?: string | null
          updated_at?: string | null
          year?: string | null
        }
      }
      mixtapes_authors: {
        Row: {
          author_id: number
          mixtape_id: number
          position: number | null
        }
        Insert: {
          author_id: number
          mixtape_id: number
          position?: number | null
        }
        Update: {
          author_id?: number
          mixtape_id?: number
          position?: number | null
        }
      }
      mixtapes_tags: {
        Row: {
          mixtape_id: number
          tag_id: number
        }
        Insert: {
          mixtape_id: number
          tag_id: number
        }
        Update: {
          mixtape_id?: number
          tag_id?: number
        }
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["roles"] | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["roles"] | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["roles"] | null
          updated_at?: string | null
        }
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: number
          name?: string
        }
      }
      tracks: {
        Row: {
          artist: string | null
          created_at: string | null
          id: number
          mixtape_id: number
          position: number | null
          start_at: string | null
          title: string | null
        }
        Insert: {
          artist?: string | null
          created_at?: string | null
          id?: number
          mixtape_id: number
          position?: number | null
          start_at?: string | null
          title?: string | null
        }
        Update: {
          artist?: string | null
          created_at?: string | null
          id?: number
          mixtape_id?: number
          position?: number | null
          start_at?: string | null
          title?: string | null
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
      roles: "public" | "user" | "editor" | "admin"
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: { size: number; bucket_id: string }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits: number
          levels: number
          offsets: number
          search: string
          sortcolumn: string
          sortorder: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

