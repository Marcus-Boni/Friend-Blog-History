import { createClient } from "@/lib/supabase/client"
import type { Story, StoryCategory, StoryStatus } from "@/types/database.types"

interface GetStoriesParams {
  category?: StoryCategory
  status?: StoryStatus
  featured?: boolean
  limit?: number
  offset?: number
}

export async function getStories(params: GetStoriesParams = {}) {
  const supabase = createClient()
  const { category, status, featured, limit = 20, offset = 0 } = params

  let query = supabase
    .from("stories")
    .select("*, profiles(username, avatar_url)")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  // Apenas aplica filtro de status se um status específico for passado
  // Isso permite que admins vejam todas as histórias (draft + published)
  if (status) {
    query = query.eq("status", status)
  }

  if (category) {
    query = query.eq("category", category)
  }

  if (featured !== undefined) {
    query = query.eq("featured", featured)
  }

  const { data, error, count } = await query

  if (error) throw error
  return { stories: data, count }
}

export async function getStoryBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("stories")
    .select("*, profiles(username, avatar_url)")
    .eq("slug", slug)
    .single()

  if (error) throw error
  return data
}

export async function getStoryWithChapters(slug: string) {
  const supabase = createClient()

  // First get the story
  const { data: story, error: storyError } = await supabase
    .from("stories")
    .select("*, profiles(username, avatar_url)")
    .eq("slug", slug)
    .single()

  if (storyError) throw storyError

  // Then get its chapters
  const { data: chapters, error: chaptersError } = await supabase
    .from("chapters")
    .select("*")
    .eq("story_id", story.id)
    .order("chapter_order", { ascending: true })

  if (chaptersError) throw chaptersError

  return { ...story, chapters }
}

export async function getChapter(storyId: string, chapterOrder: number) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("story_id", storyId)
    .eq("chapter_order", chapterOrder)
    .single()

  if (error) throw error
  return data
}

export async function getFeaturedStories(limit = 6) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("stories")
    .select("*, profiles(username, avatar_url)")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getRecentStories(limit = 6) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("stories")
    .select("*, profiles(username, avatar_url)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// Admin functions
export async function createStory(story: {
  title: string
  slug: string
  synopsis?: string
  category?: StoryCategory
  status?: StoryStatus
  cover_image_url?: string
  featured?: boolean
}) {
  const supabase = createClient()

  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("stories")
    .insert({
      ...story,
      author_id: user.user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStory(
  id: string,
  updates: Partial<Omit<Story, "id" | "created_at" | "author_id">>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("stories")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteStory(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("stories").delete().eq("id", id)

  if (error) throw error
}

export async function createChapter(chapter: {
  story_id: string
  title: string
  content?: string
  chapter_order: number
}) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chapters")
    .insert(chapter)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateChapter(
  id: string,
  updates: { title?: string; content?: string; chapter_order?: number }
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("chapters")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteChapter(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("chapters").delete().eq("id", id)

  if (error) throw error
}
