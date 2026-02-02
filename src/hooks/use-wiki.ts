"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEntityRelation,
  createEntityStoryRelation,
  createWikiEntity,
  deleteWikiEntity,
  getEntitiesByType,
  getEntityCounts,
  getWikiEntities,
  getWikiEntityById,
  getWikiEntityBySlug,
  getWikiEntityWithRelations,
  updateWikiEntity,
} from "@/lib/queries/wiki";
import { createQueryRetry } from "@/lib/utils";
import type { WikiEntityType } from "@/types/database.types";

export const wikiKeys = {
  all: ["wiki"] as const,
  lists: () => [...wikiKeys.all, "list"] as const,
  list: (filters: { type?: WikiEntityType; search?: string }) =>
    [...wikiKeys.lists(), filters] as const,
  byType: (type: WikiEntityType) => [...wikiKeys.all, "type", type] as const,
  counts: () => [...wikiKeys.all, "counts"] as const,
  details: () => [...wikiKeys.all, "detail"] as const,
  detail: (slug: string) => [...wikiKeys.details(), slug] as const,
  detailById: (id: string) => [...wikiKeys.details(), "id", id] as const,
  withRelations: (slug: string) =>
    [...wikiKeys.detail(slug), "relations"] as const,
};

const STALE_TIME = 1000 * 60 * 5;
const GC_TIME = 1000 * 60 * 30;

const shouldRetry = createQueryRetry(2);

export function useWikiEntities(
  params: {
    type?: WikiEntityType;
    limit?: number;
    offset?: number;
    search?: string;
  } = {},
) {
  return useQuery({
    queryKey: wikiKeys.list({ type: params.type, search: params.search }),
    queryFn: () => getWikiEntities(params),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

export function useWikiEntity(identifier: string, byId = false) {
  return useQuery({
    queryKey: byId
      ? wikiKeys.detailById(identifier)
      : wikiKeys.detail(identifier),
    queryFn: () =>
      byId ? getWikiEntityById(identifier) : getWikiEntityBySlug(identifier),
    enabled: !!identifier,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

export function useWikiEntityWithRelations(slug: string) {
  return useQuery({
    queryKey: wikiKeys.withRelations(slug),
    queryFn: () => getWikiEntityWithRelations(slug),
    enabled: !!slug,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
    // Improves UX by keeping previous data while refetching
    placeholderData: (previousData) => previousData,
  });
}

export function useEntitiesByType(type: WikiEntityType, limit = 10) {
  return useQuery({
    queryKey: wikiKeys.byType(type),
    queryFn: () => getEntitiesByType(type, limit),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

export function useEntityCounts() {
  return useQuery({
    queryKey: wikiKeys.counts(),
    queryFn: getEntityCounts,
    staleTime: STALE_TIME * 2, // Counts can be cached longer
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

// Mutations with optimistic updates
export function useCreateWikiEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWikiEntity,
    onSuccess: () => {
      // Invalidate all wiki queries to refresh lists
      queryClient.invalidateQueries({ queryKey: wikiKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wikiKeys.counts() });
    },
  });
}

export function useUpdateWikiEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof updateWikiEntity>[1];
    }) => updateWikiEntity(id, updates),
    onSuccess: (data) => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: wikiKeys.lists() });
      if (data.slug) {
        queryClient.invalidateQueries({ queryKey: wikiKeys.detail(data.slug) });
      }
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: wikiKeys.detailById(data.id),
        });
      }
    },
  });
}

export function useDeleteWikiEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWikiEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.lists() });
      queryClient.invalidateQueries({ queryKey: wikiKeys.counts() });
    },
  });
}

export function useCreateEntityRelation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEntityRelation,
    onSuccess: () => {
      // Only invalidate detail views with relations
      queryClient.invalidateQueries({ queryKey: wikiKeys.details() });
    },
  });
}

export function useCreateEntityStoryRelation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEntityStoryRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wikiKeys.details() });
    },
  });
}
