export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      chapters: {
        Row: {
          chapter_order: number;
          content: string | null;
          created_at: string | null;
          id: string;
          story_id: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          chapter_order?: number;
          content?: string | null;
          created_at?: string | null;
          id?: string;
          story_id: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          chapter_order?: number;
          content?: string | null;
          created_at?: string | null;
          id?: string;
          story_id?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chapters_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      entity_relations: {
        Row: {
          created_at: string | null;
          description: string | null;
          entity_a_id: string;
          entity_b_id: string;
          id: string;
          relation_type: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          entity_a_id: string;
          entity_b_id: string;
          id?: string;
          relation_type: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          entity_a_id?: string;
          entity_b_id?: string;
          id?: string;
          relation_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entity_relations_entity_a_id_fkey";
            columns: ["entity_a_id"];
            isOneToOne: false;
            referencedRelation: "wiki_entities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entity_relations_entity_b_id_fkey";
            columns: ["entity_b_id"];
            isOneToOne: false;
            referencedRelation: "wiki_entities";
            referencedColumns: ["id"];
          },
        ];
      };
      entity_story_relations: {
        Row: {
          chapter_id: string | null;
          created_at: string | null;
          entity_id: string;
          id: string;
          relation_type: string | null;
          story_id: string;
        };
        Insert: {
          chapter_id?: string | null;
          created_at?: string | null;
          entity_id: string;
          id?: string;
          relation_type?: string | null;
          story_id: string;
        };
        Update: {
          chapter_id?: string | null;
          created_at?: string | null;
          entity_id?: string;
          id?: string;
          relation_type?: string | null;
          story_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entity_story_relations_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entity_story_relations_entity_id_fkey";
            columns: ["entity_id"];
            isOneToOne: false;
            referencedRelation: "wiki_entities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "entity_story_relations_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      media: {
        Row: {
          alt_text: string | null;
          chapter_id: string | null;
          created_at: string | null;
          entity_id: string | null;
          filename: string;
          id: string;
          mime_type: string | null;
          size_bytes: number | null;
          storage_path: string;
          story_id: string | null;
          uploaded_by: string | null;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          chapter_id?: string | null;
          created_at?: string | null;
          entity_id?: string | null;
          filename: string;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          storage_path: string;
          story_id?: string | null;
          uploaded_by?: string | null;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          chapter_id?: string | null;
          created_at?: string | null;
          entity_id?: string | null;
          filename?: string;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          storage_path?: string;
          story_id?: string | null;
          uploaded_by?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_entity_id_fkey";
            columns: ["entity_id"];
            isOneToOne: false;
            referencedRelation: "wiki_entities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string;
          is_admin: boolean | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          is_admin?: boolean | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          is_admin?: boolean | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      stories: {
        Row: {
          author_id: string | null;
          category: Database["public"]["Enums"]["story_category"] | null;
          cover_image_url: string | null;
          created_at: string | null;
          featured: boolean | null;
          id: string;
          slug: string;
          status: Database["public"]["Enums"]["story_status"] | null;
          synopsis: string | null;
          title: string;
          updated_at: string | null;
          view_count: number | null;
        };
        Insert: {
          author_id?: string | null;
          category?: Database["public"]["Enums"]["story_category"] | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          featured?: boolean | null;
          id?: string;
          slug: string;
          status?: Database["public"]["Enums"]["story_status"] | null;
          synopsis?: string | null;
          title: string;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Update: {
          author_id?: string | null;
          category?: Database["public"]["Enums"]["story_category"] | null;
          cover_image_url?: string | null;
          created_at?: string | null;
          featured?: boolean | null;
          id?: string;
          slug?: string;
          status?: Database["public"]["Enums"]["story_status"] | null;
          synopsis?: string | null;
          title?: string;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "stories_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      wiki_entities: {
        Row: {
          created_at: string | null;
          entity_type: Database["public"]["Enums"]["wiki_entity_type"];
          full_description: string | null;
          id: string;
          image_url: string | null;
          map_layer: string | null;
          name: string;
          properties: Json | null;
          short_description: string | null;
          slug: string;
          updated_at: string | null;
          x_coord: number | null;
          y_coord: number | null;
          z_coord: number | null;
        };
        Insert: {
          created_at?: string | null;
          entity_type: Database["public"]["Enums"]["wiki_entity_type"];
          full_description?: string | null;
          id?: string;
          image_url?: string | null;
          map_layer?: string | null;
          name: string;
          properties?: Json | null;
          short_description?: string | null;
          slug: string;
          updated_at?: string | null;
          x_coord?: number | null;
          y_coord?: number | null;
          z_coord?: number | null;
        };
        Update: {
          created_at?: string | null;
          entity_type?: Database["public"]["Enums"]["wiki_entity_type"];
          full_description?: string | null;
          id?: string;
          image_url?: string | null;
          map_layer?: string | null;
          name?: string;
          properties?: Json | null;
          short_description?: string | null;
          slug?: string;
          updated_at?: string | null;
          x_coord?: number | null;
          y_coord?: number | null;
          z_coord?: number | null;
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
      story_category:
        | "dream"
        | "idea"
        | "thought"
        | "tale"
        | "chronicle"
        | "other";
      story_status: "draft" | "published" | "archived";
      wiki_entity_type:
        | "character"
        | "location"
        | "fact"
        | "event"
        | "item"
        | "concept"
        | "organization";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types for easier usage
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// Specific type exports for convenience
export type Profile = Tables<"profiles">;
export type Story = Tables<"stories">;
export type Chapter = Tables<"chapters">;
export type WikiEntity = Tables<"wiki_entities">;
export type EntityRelation = Tables<"entity_relations">;
export type EntityStoryRelation = Tables<"entity_story_relations">;
export type Media = Tables<"media">;

export type StoryCategory = Enums<"story_category">;
export type StoryStatus = Enums<"story_status">;
export type WikiEntityType = Enums<"wiki_entity_type">;
