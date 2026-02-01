"use client"

import { StoryCard, StoryCardSkeleton } from "./story-card"
import type { Story } from "@/types/database.types"

interface StoryGridProps {
  stories?: (Story & { profiles?: { username: string | null; avatar_url: string | null } | null })[]
  isLoading?: boolean
  emptyMessage?: string
}

export function StoryGrid({ stories, isLoading, emptyMessage = "Nenhuma história encontrada." }: StoryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StoryCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story, index) => (
        <StoryCard key={story.id} story={story} index={index} />
      ))}
    </div>
  )
}
