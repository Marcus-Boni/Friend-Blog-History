-- =====================================================
-- Imperial Codex - Row Level Security Policies
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- PROFILES
-- =====================================================

-- Permitir que todos vejam perfis públicos
CREATE POLICY "Perfis públicos são visíveis por todos"
ON profiles FOR SELECT
USING (true);

-- Permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Usuários podem atualizar próprio perfil"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- =====================================================
-- STORIES
-- =====================================================

-- Público pode ver histórias publicadas
CREATE POLICY "Histórias publicadas são públicas"
ON stories FOR SELECT
USING (status = 'published');

-- Admins podem ver todas as histórias
CREATE POLICY "Admins veem todas histórias"
ON stories FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admins podem inserir histórias
CREATE POLICY "Admins podem criar histórias"
ON stories FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admins podem atualizar histórias
CREATE POLICY "Admins podem atualizar histórias"
ON stories FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admins podem deletar histórias
CREATE POLICY "Admins podem deletar histórias"
ON stories FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- =====================================================
-- CHAPTERS
-- =====================================================

-- Público pode ver capítulos de histórias publicadas
CREATE POLICY "Capítulos de histórias publicadas são públicos"
ON chapters FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM stories
    WHERE stories.id = chapters.story_id
    AND stories.status = 'published'
  )
);

-- Admins veem todos os capítulos
CREATE POLICY "Admins veem todos capítulos"
ON chapters FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admins podem criar capítulos
CREATE POLICY "Admins podem criar capítulos"
ON chapters FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admins podem atualizar capítulos
CREATE POLICY "Admins podem atualizar capítulos"
ON chapters FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admins podem deletar capítulos
CREATE POLICY "Admins podem deletar capítulos"
ON chapters FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- =====================================================
-- WIKI_ENTITIES
-- =====================================================

-- Todos podem ver entidades wiki
CREATE POLICY "Entidades wiki são públicas"
ON wiki_entities FOR SELECT
USING (true);

-- Admins podem criar entidades
CREATE POLICY "Admins podem criar entidades"
ON wiki_entities FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admins podem atualizar entidades
CREATE POLICY "Admins podem atualizar entidades"
ON wiki_entities FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Admins podem deletar entidades
CREATE POLICY "Admins podem deletar entidades"
ON wiki_entities FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- =====================================================
-- ENTITY_RELATIONS
-- =====================================================

CREATE POLICY "Relações são públicas"
ON entity_relations FOR SELECT
USING (true);

CREATE POLICY "Admins podem criar relações"
ON entity_relations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins podem deletar relações"
ON entity_relations FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- =====================================================
-- ENTITY_STORY_RELATIONS
-- =====================================================

CREATE POLICY "Relações história-entidade são públicas"
ON entity_story_relations FOR SELECT
USING (true);

CREATE POLICY "Admins podem criar relações história-entidade"
ON entity_story_relations FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins podem deletar relações história-entidade"
ON entity_story_relations FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- =====================================================
-- MEDIA (para quando você adicionar uploads)
-- =====================================================

CREATE POLICY "Mídia é pública"
ON media FOR SELECT
USING (true);

CREATE POLICY "Admins podem gerenciar mídia"
ON media FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
);
