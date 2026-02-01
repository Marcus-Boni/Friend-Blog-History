"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Share2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Header, Footer } from "@/components/layout"
import { useStoryWithChapters } from "@/hooks"
import type { StoryCategory } from "@/types/database.types"

const categoryLabels: Record<StoryCategory, string> = {
  dream: "Sonho",
  idea: "Ideia",
  thought: "Pensamento",
  tale: "Conto",
  chronicle: "Crônica",
  other: "Outro",
}

interface StoryPageProps {
  params: Promise<{ slug: string }>
}

export default function StoryPage({ params }: StoryPageProps) {
  const { slug } = use(params)
  const { data: story, isLoading, error } = useStoryWithChapters(slug)

  if (error) {
    notFound()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-imperial-gradient">
        <Header />
        <div className="pt-32 pb-16 container mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!story) {
    notFound()
  }

  const formattedDate = story.created_at
    ? new Date(story.created_at).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <div className="min-h-screen bg-imperial-gradient">
      <Header />

      {/* Back button */}
      <div className="pt-24 container mx-auto px-4">
        <Link href="/stories">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar às histórias
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Cover Image */}
            {story.cover_image_url && (
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8">
                <Image
                  src={story.cover_image_url}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              </div>
            )}

            {/* Category Badge */}
            {story.category && (
              <Badge
                variant="outline"
                className="mb-4 border-crimson/50 text-crimson"
              >
                {categoryLabels[story.category]}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {story.title}
            </h1>

            {/* Synopsis */}
            {story.synopsis && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {story.synopsis}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              {story.profiles?.username && (
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {story.profiles.username}
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
              )}
              {story.chapters && (
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {story.chapters.length} capítulo{story.chapters.length !== 1 ? "s" : ""}
                </span>
              )}
              {story.view_count !== null && story.view_count > 0 && (
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {story.view_count} visualizações
                </span>
              )}
            </div>

            <Separator className="mb-8" />

            {/* Chapters */}
            {story.chapters && story.chapters.length > 0 ? (
              <div className="space-y-8">
                {story.chapters.map((chapter, index) => (
                  <motion.article
                    key={chapter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="prose prose-invert prose-lg max-w-none"
                  >
                    <h2 className="text-2xl font-bold text-gold mb-4">
                      Capítulo {chapter.chapter_order}: {chapter.title}
                    </h2>
                    <div
                      className="text-foreground/90 leading-relaxed whitespace-pre-wrap"
                      // biome-ignore lint: Content from admin only
                      dangerouslySetInnerHTML={{ __html: chapter.content || "" }}
                    />
                    {index < story.chapters.length - 1 && (
                      <Separator className="my-12" />
                    )}
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card/30 rounded-xl">
                <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Esta história ainda não possui capítulos.
                </p>
              </div>
            )}

            {/* Navigation */}
            <Separator className="my-12" />

            <div className="flex justify-between items-center">
              <Link href="/stories">
                <Button variant="outline" className="border-crimson/50 text-crimson hover:bg-crimson/10">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Todas as histórias
                </Button>
              </Link>
              <Button variant="ghost" className="text-muted-foreground">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
