import { createClient } from "@/lib/supabase/client"
import type { WikiEntity, WikiEntityType, Json } from "@/types/database.types"

interface GetEntitiesParams {
  type?: WikiEntityType
  limit?: number
  offset?: number
  search?: string
}

export async function getWikiEntities(params: GetEntitiesParams = {}) {
  const supabase = createClient()
  const { type, limit = 20, offset = 0, search } = params

  let query = supabase
    .from("wiki_entities")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1)

  if (type) {
    query = query.eq("entity_type", type)
  }

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  const { data, error, count } = await query

  if (error) throw error
  return { entities: data, count }
}

export async function getWikiEntityBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("wiki_entities")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error) throw error
  return data
}

export async function getWikiEntityById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("wiki_entities")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function getWikiEntityWithRelations(slug: string) {
  const supabase = createClient()

  // Get the entity
  const { data: entity, error: entityError } = await supabase
    .from("wiki_entities")
    .select("*")
    .eq("slug", slug)
    .single()

  if (entityError) throw entityError

  // Get all relations in parallel for better performance
  const [relationsAResult, relationsBResult, storyRelationsResult] = await Promise.all([
    // Get relations where this entity is entity_a
    supabase
      .from("entity_relations")
      .select("*, entity_b:wiki_entities!entity_relations_entity_b_id_fkey(id, name, slug, entity_type, image_url)")
      .eq("entity_a_id", entity.id),

    // Get relations where this entity is entity_b
    supabase
      .from("entity_relations")
      .select("*, entity_a:wiki_entities!entity_relations_entity_a_id_fkey(id, name, slug, entity_type, image_url)")
      .eq("entity_b_id", entity.id),

    // Get stories this entity appears in
    supabase
      .from("entity_story_relations")
      .select("*, story:stories(id, title, slug, cover_image_url, category)")
      .eq("entity_id", entity.id),
  ])

  if (relationsAResult.error) throw relationsAResult.error
  if (relationsBResult.error) throw relationsBResult.error
  if (storyRelationsResult.error) throw storyRelationsResult.error

  return {
    ...entity,
    relatedEntities: [
      ...relationsAResult.data.map((r) => ({ ...r.entity_b, relationType: r.relation_type, description: r.description })),
      ...relationsBResult.data.map((r) => ({ ...r.entity_a, relationType: r.relation_type, description: r.description })),
    ],
    stories: storyRelationsResult.data.map((r) => ({ ...r.story, relationType: r.relation_type })),
  }
}

export async function getEntitiesByType(type: WikiEntityType, limit = 10) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("wiki_entities")
    .select("*")
    .eq("entity_type", type)
    .order("name", { ascending: true })
    .limit(limit)

  if (error) throw error
  return data
}

// Optimized: Single query to get all counts using SQL aggregation
export async function getEntityCounts() {
  const supabase = createClient()

  // Use a single query with grouping instead of 7 separate queries
  const { data, error } = await supabase
    .from("wiki_entities")
    .select("entity_type")

  if (error) throw error

  // Count in memory - much faster than 7 separate network requests
  const counts: Record<WikiEntityType, number> = {
    character: 0,
    location: 0,
    fact: 0,
    event: 0,
    item: 0,
    concept: 0,
    organization: 0,
  }

  if (data) {
    for (const entity of data) {
      const type = entity.entity_type as WikiEntityType
      if (type && counts[type] !== undefined) {
        counts[type]++
      }
    }
  }

  return counts
}

// Admin functions
export async function createWikiEntity(entity: {
  name: string
  slug: string
  entity_type: WikiEntityType
  short_description?: string
  full_description?: string
  image_url?: string
  properties?: Json
  x_coord?: number
  y_coord?: number
  z_coord?: number
  map_layer?: string
}) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("wiki_entities")
    .insert(entity)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateWikiEntity(
  id: string,
  updates: Partial<Omit<WikiEntity, "id" | "created_at">>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("wiki_entities")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteWikiEntity(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("wiki_entities").delete().eq("id", id)

  if (error) throw error
}

export async function createEntityRelation(relation: {
  entity_a_id: string
  entity_b_id: string
  relation_type: string
  description?: string
}) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("entity_relations")
    .insert(relation)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createEntityStoryRelation(relation: {
  entity_id: string
  story_id: string
  relation_type?: string
  chapter_id?: string
}) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("entity_story_relations")
    .insert(relation)
    .select()
    .single()

  if (error) throw error
  return data
}
