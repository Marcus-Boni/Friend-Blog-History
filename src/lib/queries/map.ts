"use server";

import { createClient } from "@/lib/supabase/server";
import type { WikiEntity, WikiEntityType } from "@/types/database.types";

export interface MapMarker {
  id: string;
  name: string;
  slug: string;
  entityType: WikiEntityType;
  shortDescription: string | null;
  imageUrl: string | null;
  x: number;
  y: number;
  layer: string | null;
}

export interface MapEntityDetails extends WikiEntity {
  relatedStories: Array<{
    id: string;
    title: string;
    slug: string;
    category: string | null;
  }>;
  relatedEntities: Array<{
    id: string;
    name: string;
    slug: string;
    entityType: WikiEntityType;
    relationType: string;
  }>;
}

/**
 * Fetches all entities that have map coordinates
 */
export async function getMapMarkers(options?: {
  layer?: string;
  entityTypes?: WikiEntityType[];
}): Promise<MapMarker[]> {
  const supabase = await createClient();

  let query = supabase
    .from("wiki_entities")
    .select(
      "id, name, slug, entity_type, short_description, image_url, x_coord, y_coord, map_layer",
    )
    .not("x_coord", "is", null)
    .not("y_coord", "is", null);

  if (options?.layer) {
    query = query.eq("map_layer", options.layer);
  }

  if (options?.entityTypes && options.entityTypes.length > 0) {
    query = query.in("entity_type", options.entityTypes);
  }

  const { data, error } = await query.order("name");

  if (error) {
    console.error("Error fetching map markers:", error);
    throw error;
  }

  return (data || []).map((entity) => ({
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    entityType: entity.entity_type,
    shortDescription: entity.short_description,
    imageUrl: entity.image_url,
    x: entity.x_coord!,
    y: entity.y_coord!,
    layer: entity.map_layer,
  }));
}

/**
 * Fetches detailed information for a map marker popup
 */
export async function getMapEntityDetails(
  id: string,
): Promise<MapEntityDetails | null> {
  const supabase = await createClient();

  // Fetch entity data
  const { data: entity, error } = await supabase
    .from("wiki_entities")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !entity) {
    console.error("Error fetching map entity:", error);
    return null;
  }

  // Fetch related stories
  const { data: storyRelations } = await supabase
    .from("entity_story_relations")
    .select(`
      story_id,
      stories:stories!entity_story_relations_story_id_fkey (
        id,
        title,
        slug,
        category
      )
    `)
    .eq("entity_id", id);

  // Fetch related entities (both directions)
  const { data: relationsA } = await supabase
    .from("entity_relations")
    .select(`
      relation_type,
      entity_b:wiki_entities!entity_relations_entity_b_id_fkey (
        id,
        name,
        slug,
        entity_type
      )
    `)
    .eq("entity_a_id", id);

  const { data: relationsB } = await supabase
    .from("entity_relations")
    .select(`
      relation_type,
      entity_a:wiki_entities!entity_relations_entity_a_id_fkey (
        id,
        name,
        slug,
        entity_type
      )
    `)
    .eq("entity_b_id", id);

  const relatedStories = (storyRelations || [])
    .filter((r) => r.stories)
    .map((r) => ({
      id: (r.stories as { id: string }).id,
      title: (r.stories as { title: string }).title,
      slug: (r.stories as { slug: string }).slug,
      category: (r.stories as { category: string | null }).category,
    }));

  const relatedEntities = [
    ...(relationsA || [])
      .filter((r) => r.entity_b)
      .map((r) => ({
        id: (r.entity_b as { id: string }).id,
        name: (r.entity_b as { name: string }).name,
        slug: (r.entity_b as { slug: string }).slug,
        entityType: (r.entity_b as { entity_type: WikiEntityType }).entity_type,
        relationType: r.relation_type,
      })),
    ...(relationsB || [])
      .filter((r) => r.entity_a)
      .map((r) => ({
        id: (r.entity_a as { id: string }).id,
        name: (r.entity_a as { name: string }).name,
        slug: (r.entity_a as { slug: string }).slug,
        entityType: (r.entity_a as { entity_type: WikiEntityType }).entity_type,
        relationType: r.relation_type,
      })),
  ];

  return {
    ...entity,
    relatedStories,
    relatedEntities,
  };
}

/**
 * Fetches all unique map layers
 */
export async function getMapLayers(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wiki_entities")
    .select("map_layer")
    .not("map_layer", "is", null)
    .not("x_coord", "is", null);

  if (error) {
    console.error("Error fetching map layers:", error);
    return [];
  }

  const layers = [
    ...new Set(data.map((d) => d.map_layer).filter(Boolean)),
  ] as string[];
  return layers.sort();
}

/**
 * Updates entity map coordinates
 */
export async function updateEntityMapPosition(
  id: string,
  x: number,
  y: number,
  layer?: string,
): Promise<void> {
  const supabase = await createClient();

  const updates: { x_coord: number; y_coord: number; map_layer?: string } = {
    x_coord: x,
    y_coord: y,
  };

  if (layer !== undefined) {
    updates.map_layer = layer;
  }

  const { error } = await supabase
    .from("wiki_entities")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating entity map position:", error);
    throw error;
  }
}

/**
 * Searches for entities to add to the map
 */
export async function searchEntitiesForMap(
  query: string,
  limit = 10,
): Promise<
  Array<{
    id: string;
    name: string;
    entityType: WikiEntityType;
    hasCoords: boolean;
  }>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wiki_entities")
    .select("id, name, entity_type, x_coord")
    .ilike("name", `%${query}%`)
    .limit(limit);

  if (error) {
    console.error("Error searching entities:", error);
    return [];
  }

  return (data || []).map((e) => ({
    id: e.id,
    name: e.name,
    entityType: e.entity_type,
    hasCoords: e.x_coord !== null,
  }));
}
