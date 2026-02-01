-- =====================================================
-- Centuriões Verbum - Complete Database Schema
-- Execute este script PRIMEIRO no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================
CREATE TYPE story_category AS ENUM ('dream', 'idea', 'thought', 'tale', 'chronicle', 'other');
CREATE TYPE story_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE wiki_entity_type AS ENUM ('character', 'location', 'fact', 'event', 'item', 'concept', 'organization');

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  email TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STORIES TABLE
-- =====================================================
CREATE TABLE stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  synopsis TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category story_category DEFAULT 'tale',
  status story_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_author ON stories(author_id);

-- =====================================================
-- CHAPTERS TABLE
-- =====================================================
CREATE TABLE chapters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  chapter_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_chapters_story ON chapters(story_id);
CREATE INDEX idx_chapters_order ON chapters(chapter_order);

-- =====================================================
-- WIKI_ENTITIES TABLE
-- =====================================================
CREATE TABLE wiki_entities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  entity_type wiki_entity_type NOT NULL,
  short_description TEXT,
  full_description TEXT,
  image_url TEXT,
  properties JSONB DEFAULT '{}',
  x_coord REAL,
  y_coord REAL,
  z_coord REAL,
  map_layer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wiki_entities ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_wiki_slug ON wiki_entities(slug);
CREATE INDEX idx_wiki_type ON wiki_entities(entity_type);
CREATE INDEX idx_wiki_coords ON wiki_entities(x_coord, y_coord, z_coord);

-- =====================================================
-- ENTITY_RELATIONS TABLE
-- =====================================================
CREATE TABLE entity_relations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_a_id UUID REFERENCES wiki_entities(id) ON DELETE CASCADE NOT NULL,
  entity_b_id UUID REFERENCES wiki_entities(id) ON DELETE CASCADE NOT NULL,
  relation_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE entity_relations ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_relations_a ON entity_relations(entity_a_id);
CREATE INDEX idx_relations_b ON entity_relations(entity_b_id);

-- =====================================================
-- ENTITY_STORY_RELATIONS TABLE
-- =====================================================
CREATE TABLE entity_story_relations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_id UUID REFERENCES wiki_entities(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  relation_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE entity_story_relations ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_entity_story_entity ON entity_story_relations(entity_id);
CREATE INDEX idx_entity_story_story ON entity_story_relations(story_id);

-- =====================================================
-- MEDIA TABLE
-- =====================================================
CREATE TABLE media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  alt_text TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wiki_entities_updated_at
  BEFORE UPDATE ON wiki_entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
