"use client"

import { use } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Users,
  MapPin,
  Calendar,
  Package,
  Lightbulb,
  Building2,
  Scroll,
  Link as LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Header, Footer } from "@/components/layout"
import { useWikiEntityWithRelations } from "@/hooks"
import type { WikiEntityType } from "@/types/database.types"

const typeLabels: Record<WikiEntityType, string> = {
  character: "Personagem",
  location: "Local",
  fact: "Fato",
  event: "Evento",
  item: "Item",
  concept: "Conceito",
  organization: "Organização",
}

const typeIcons: Record<WikiEntityType, typeof Users> = {
  character: Users,
  location: MapPin,
  fact: Scroll,
  event: Calendar,
  item: Package,
  concept: Lightbulb,
  organization: Building2,
}

interface EntityPageProps {
  params: Promise<{ type: string; slug: string }>
}

export default function EntityPage({ params }: EntityPageProps) {
  const { slug } = use(params)
  const { data: entity, isLoading, error } = useWikiEntityWithRelations(slug)

  if (error) {
    notFound()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-imperial-gradient">
        <Header />
        <div className="pt-32 pb-16 container mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="md:col-span-2">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!entity) {
    notFound()
  }

  const Icon = typeIcons[entity.entity_type]

  return (
    <div className="min-h-screen bg-imperial-gradient">
      <Header />

      {/* Back button */}
      <div className="pt-24 container mx-auto px-4">
        <Link href="/wiki">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Wiki
          </Button>
        </Link>
      </div>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="sticky top-24">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-card border border-border/50">
                  {entity.image_url ? (
                    <Image
                      src={entity.image_url}
                      alt={entity.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/5 to-crimson/5">
                      <Icon className="w-24 h-24 text-gold/20" />
                    </div>
                  )}
                </div>

                {/* Quick info card */}
                <Card className="mt-4 bg-card/50 border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tipo</span>
                      <Badge variant="outline" className="border-gold/50 text-gold">
                        <Icon className="w-3 h-3 mr-1" />
                        {typeLabels[entity.entity_type]}
                      </Badge>
                    </div>
                    {entity.x_coord !== null && entity.y_coord !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Coordenadas</span>
                        <span className="text-sm font-mono">
                          ({entity.x_coord}, {entity.y_coord}
                          {entity.z_coord !== null && `, ${entity.z_coord}`})
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2"
            >
              <Badge
                variant="outline"
                className="mb-4 border-gold/50 text-gold"
              >
                {typeLabels[entity.entity_type].toUpperCase()}
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {entity.name}
              </h1>

              {entity.short_description && (
                <p className="text-xl text-muted-foreground mb-8">
                  {entity.short_description}
                </p>
              )}

              <Separator className="my-8" />

              {/* Full description */}
              {entity.full_description && (
                <div className="prose prose-invert prose-lg max-w-none mb-8">
                  <div
                    className="text-foreground/90 leading-relaxed whitespace-pre-wrap"
                    // biome-ignore lint: Content from admin only
                    dangerouslySetInnerHTML={{ __html: entity.full_description }}
                  />
                </div>
              )}

              {/* Related Stories */}
              {entity.stories && entity.stories.length > 0 && (
                <Card className="mb-8 bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-crimson">
                      <BookOpen className="w-5 h-5" />
                      Aparece em
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {entity.stories.map((story) => (
                        <Link
                          key={story.id}
                          href={`/stories/${story.slug}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <span className="font-medium">{story.title}</span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Entities */}
              {entity.relatedEntities && entity.relatedEntities.length > 0 && (
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gold">
                      <LinkIcon className="w-5 h-5" />
                      Relações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {entity.relatedEntities.map((related) => {
                        const RelatedIcon = typeIcons[related.entity_type]
                        return (
                          <Link
                            key={related.id}
                            href={`/wiki/${related.entity_type}/${related.slug}`}
                            className="group flex flex-col items-center p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-center"
                          >
                            {related.image_url ? (
                              <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2">
                                <Image
                                  src={related.image_url}
                                  alt={related.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-2">
                                <RelatedIcon className="w-8 h-8 text-gold/50" />
                              </div>
                            )}
                            <span className="font-medium text-sm group-hover:text-gold transition-colors">
                              {related.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {related.relationType}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
