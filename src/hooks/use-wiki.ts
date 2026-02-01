"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getWikiEntities,
  getWikiEntityBySlug,
  getWikiEntityWithRelations,
  getEntitiesByType,
  getEntityCounts,
  createWikiEntity,
  updateWikiEntity,
  deleteWikiEntity,
  createEntityRelation,
  createEntityStoryRelation,
} from "@/lib/queries/wiki"
import type { WikiEntityType } from "@/types/database.types"

export const wikiKeys = {
  all: ["wiki"] as const,
  lists: () => [...wikiKeys.all, "list"] as const,
  list: (filters: { type?: WikiEntityType; search?: string }) =>
    [...wikiKeys.lists(), filters] as const,
  byType: (type: WikiEntityType) => [...wikiKeys.all, "type", type] as const,
  counts: () => [...wikiKeys.all, "counts"] as const,
  details: () => [...wikiKeys.all, "detail"] as const,
  detail: (slug: string) => [...wikiKeys.details(), slug] as const,
  withRelations: (slug: string) => [...wikiKeys.detail(slug), "relations"] as const,
}

export function useWikiEntities(params: {
  type?: WikiEntityType
  limit?: number
  offset?: number
  search?: string
} = {}) {
  return useQuery({
    queryKey: wikiKeys.list({ type: params.type, search: params.search }),
    queryFn: () => getWikiEntities(params),
  })
}

export function useWikiEntity(slug: string) {
  return useQuery({
    queryKey: wikiKeys.detail(slug),
    queryFn: () => getWikiEntityBySlug(slug),
    enabled: !!slug,
  })
}

export function useWikiEntityWithRelations(slug: string) {
  return useQuery({
    queryKey: wikiKeys.withRelations(slug),
    queryFn: () => getWikiEntityWithRelations(slug),
    enabled: !!slug,
  })
}

export function useEntitiesByType(type: WikiEntityType, limit = 10) {
  return useQuery({
    queryKey: wikiKeys.byType(type),
    queryFn: () => getEntitiesByType(type, limit),
  })
}

export function useEntityCounts() {
  return useQuery({
    queryKey: wikiKeys.counts(),
    queryFn: getEntityCounts,
  })
}

// Mutations
export function useCreateWikiEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWikiEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.all })
    },
  })
}

export function useUpdateWikiEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof updateWikiEntity>[1] }) =>
      updateWikiEntity(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.all })
      if (data.slug) {
        queryClient.invalidateQueries({ queryKey: wikiKeys.detail(data.slug) })
      }
    },
  })
}

export function useDeleteWikiEntity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWikiEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.all })
    },
  })
}

export function useCreateEntityRelation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEntityRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.all })
    },
  })
}

export function useCreateEntityStoryRelation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEntityStoryRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.all })
    },
  })
}
