"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createChapter,
  createStory,
  deleteChapter,
  deleteStory,
  getFeaturedStories,
  getRecentStories,
  getStories,
  getStoryBySlug,
  getStoryWithChapters,
  getStoryWithChaptersById,
  updateChapter,
  updateStory,
} from "@/lib/queries/stories";
import { createQueryRetry } from "@/lib/utils";
import type { StoryCategory, StoryStatus } from "@/types/database.types";

// Query key factory for consistent caching
export const storyKeys = {
  all: ["stories"] as const,
  lists: () => [...storyKeys.all, "list"] as const,
  list: (filters: { category?: StoryCategory; status?: StoryStatus }) =>
    [...storyKeys.lists(), filters] as const,
  featured: () => [...storyKeys.all, "featured"] as const,
  recent: () => [...storyKeys.all, "recent"] as const,
  details: () => [...storyKeys.all, "detail"] as const,
  detail: (slug: string) => [...storyKeys.details(), slug] as const,
  detailById: (id: string) => [...storyKeys.details(), "id", id] as const,
  withChapters: (slug: string) =>
    [...storyKeys.detail(slug), "chapters"] as const,
  withChaptersById: (id: string) =>
    [...storyKeys.detailById(id), "chapters"] as const,
};

// Cache configuration for better performance
const STALE_TIME = 1000 * 60 * 5; // 5 minutes
const GC_TIME = 1000 * 60 * 30; // 30 minutes

// Custom retry function that doesn't retry on AbortErrors
const shouldRetry = createQueryRetry(2);

export function useStories(
  params: {
    category?: StoryCategory;
    status?: StoryStatus;
    limit?: number;
    offset?: number;
  } = {},
) {
  return useQuery({
    queryKey: storyKeys.list({
      category: params.category,
      status: params.status,
    }),
    queryFn: () => getStories(params),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

export function useStory(slug: string) {
  return useQuery({
    queryKey: storyKeys.detail(slug),
    queryFn: () => getStoryBySlug(slug),
    enabled: !!slug,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

export function useStoryWithChapters(identifier: string, byId = false) {
  return useQuery({
    queryKey: byId
      ? storyKeys.withChaptersById(identifier)
      : storyKeys.withChapters(identifier),
    queryFn: () =>
      byId
        ? getStoryWithChaptersById(identifier)
        : getStoryWithChapters(identifier),
    enabled: !!identifier,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
    // Improves UX by keeping previous data while refetching
    placeholderData: (previousData) => previousData,
  });
}

export function useFeaturedStories(limit = 6) {
  return useQuery({
    queryKey: storyKeys.featured(),
    queryFn: () => getFeaturedStories(limit),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

export function useRecentStories(limit = 6) {
  return useQuery({
    queryKey: storyKeys.recent(),
    queryFn: () => getRecentStories(limit),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

// Mutations
export function useCreateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storyKeys.featured() });
      queryClient.invalidateQueries({ queryKey: storyKeys.recent() });
    },
  });
}

export function useUpdateStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof updateStory>[1];
    }) => updateStory(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
      if (data.slug) {
        queryClient.invalidateQueries({
          queryKey: storyKeys.detail(data.slug),
        });
        queryClient.invalidateQueries({
          queryKey: storyKeys.withChapters(data.slug),
        });
      }
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: storyKeys.detailById(data.id),
        });
        queryClient.invalidateQueries({
          queryKey: storyKeys.withChaptersById(data.id),
        });
      }
    },
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storyKeys.featured() });
      queryClient.invalidateQueries({ queryKey: storyKeys.recent() });
    },
  });
}

export function useCreateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.details() });
    },
  });
}

export function useUpdateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Parameters<typeof updateChapter>[1];
    }) => updateChapter(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.details() });
    },
  });
}

export function useDeleteChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.details() });
    },
  });
}
