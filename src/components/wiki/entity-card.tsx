"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Users, MapPin, Scroll, Calendar, Package, Lightbulb, Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { WikiEntity, WikiEntityType } from "@/types/database.types"

interface EntityCardProps {
  entity: WikiEntity
  index?: number
}

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

const typeColors: Record<WikiEntityType, string> = {
  character: "text-crimson border-crimson/30 bg-crimson/10",
  location: "text-green-400 border-green-400/30 bg-green-400/10",
  fact: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  event: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  item: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  concept: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  organization: "text-gold border-gold/30 bg-gold/10",
}

export function EntityCard({ entity, index = 0 }: EntityCardProps) {
  const Icon = typeIcons[entity.entity_type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/wiki/${entity.entity_type}/${entity.slug}`}>
        <Card className="group h-full bg-card/50 border-border/50 hover:border-gold/50 transition-all duration-300 cursor-pointer overflow-hidden">
          <CardContent className="p-0">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-secondary">
              {entity.image_url ? (
                <Image
                  src={entity.image_url}
                  alt={entity.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold/5 to-crimson/5">
                  <Icon className="w-16 h-16 text-gold/20" />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Type badge */}
              <div className="absolute top-3 left-3">
                <Badge
                  variant="outline"
                  className={typeColors[entity.entity_type]}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {typeLabels[entity.entity_type]}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                {entity.name}
              </h3>
              {entity.short_description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entity.short_description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export function EntityCardSkeleton() {
  return (
    <Card className="h-full bg-card/50 border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="aspect-square" />
        <div className="p-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
