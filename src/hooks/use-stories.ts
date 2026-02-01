"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getStories,
  getStoryBySlug,
  getStoryWithChapters,
  getFeaturedStories,
  getRecentStories,
  createStory,
  updateStory,
  deleteStory,
  createChapter,
  updateChapter,
  deleteChapter,
} from "@/lib/queries/stories"
import type { StoryCategory, StoryStatus } from "@/types/database.types"

export const storyKeys = {
  all: ["stories"] as const,
  lists: () => [...storyKeys.all, "list"] as const,
  list: (filters: { category?: StoryCategory; status?: StoryStatus }) =>
    [...storyKeys.lists(), filters] as const,
  featured: () => [...storyKeys.all, "featured"] as const,
  recent: () => [...storyKeys.all, "recent"] as const,
  details: () => [...storyKeys.all, "detail"] as const,
  detail: (slug: string) => [...storyKeys.details(), slug] as const,
  withChapters: (slug: string) => [...storyKeys.detail(slug), "chapters"] as const,
}

export function useStories(params: {
  category?: StoryCategory
  status?: StoryStatus
  limit?: number
  offset?: number
} = {}) {
  return useQuery({
    queryKey: storyKeys.list({ category: params.category, status: params.status }),
    queryFn: () => getStories(params),
  })
}

export function useStory(slug: string) {
  return useQuery({
    queryKey: storyKeys.detail(slug),
    queryFn: () => getStoryBySlug(slug),
    enabled: !!slug,
  })
}

export function useStoryWithChapters(slug: string) {
  return useQuery({
    queryKey: storyKeys.withChapters(slug),
    queryFn: () => getStoryWithChapters(slug),
    enabled: !!slug,
  })
}

export function useFeaturedStories(limit = 6) {
  return useQuery({
    queryKey: storyKeys.featured(),
    queryFn: () => getFeaturedStories(limit),
  })
}

export function useRecentStories(limit = 6) {
  return useQuery({
    queryKey: storyKeys.recent(),
    queryFn: () => getRecentStories(limit),
  })
}

// Mutations
export function useCreateStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.all })
    },
  })
}

export function useUpdateStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof updateStory>[1] }) =>
      updateStory(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: storyKeys.all })
      if (data.slug) {
        queryClient.invalidateQueries({ queryKey: storyKeys.detail(data.slug) })
      }
    },
  })
}

export function useDeleteStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.all })
    },
  })
}

export function useCreateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.all })
    },
  })
}

export function useUpdateChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof updateChapter>[1] }) =>
      updateChapter(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.all })
    },
  })
}

export function useDeleteChapter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storyKeys.all })
    },
  })
}
