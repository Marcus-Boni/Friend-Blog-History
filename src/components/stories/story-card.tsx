"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, Clock, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Story, StoryCategory } from "@/types/database.types"

interface StoryCardProps {
  story: Story & { profiles?: { username: string | null; avatar_url: string | null } | null }
  index?: number
}

const categoryLabels: Record<StoryCategory, string> = {
  dream: "Sonho",
  idea: "Ideia",
  thought: "Pensamento",
  tale: "Conto",
  chronicle: "Crônica",
  other: "Outro",
}

const categoryColors: Record<StoryCategory, string> = {
  dream: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  idea: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  thought: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  tale: "bg-crimson/20 text-crimson border-crimson/30",
  chronicle: "bg-gold/20 text-gold border-gold/30",
  other: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
}

export function StoryCard({ story, index = 0 }: StoryCardProps) {
  const formattedDate = story.created_at
    ? new Date(story.created_at).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/stories/${story.slug}`}>
        <Card className="group h-full bg-card/50 border-border/50 hover:border-crimson/50 transition-all duration-300 overflow-hidden cursor-pointer">
          {/* Cover Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
            {story.cover_image_url ? (
              <Image
                src={story.cover_image_url}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-crimson/10 to-gold/5">
                <BookOpen className="w-12 h-12 text-crimson/30" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            
            {/* Category badge */}
            {story.category && (
              <div className="absolute top-3 left-3">
                <Badge
                  variant="outline"
                  className={categoryColors[story.category]}
                >
                  {categoryLabels[story.category]}
                </Badge>
              </div>
            )}

            {/* Featured badge */}
            {story.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-gold text-black">Destaque</Badge>
              </div>
            )}
          </div>

          <CardContent className="p-5">
            {/* Title */}
            <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-crimson transition-colors">
              {story.title}
            </h3>

            {/* Synopsis */}
            {story.synopsis && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {story.synopsis}
              </p>
            )}

            {/* Meta info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formattedDate}
                </span>
              )}
              {story.view_count !== null && story.view_count > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {story.view_count}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export function StoryCardSkeleton() {
  return (
    <Card className="h-full bg-card/50 border-border/50 overflow-hidden">
      <Skeleton className="aspect-[16/10]" />
      <CardContent className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  )
}
