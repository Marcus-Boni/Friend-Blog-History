"use client"

import { EntityCard, EntityCardSkeleton } from "./entity-card"
import type { WikiEntity } from "@/types/database.types"

interface EntityGridProps {
  entities?: WikiEntity[]
  isLoading?: boolean
  emptyMessage?: string
}

export function EntityGrid({ entities, isLoading, emptyMessage = "Nenhuma entidade encontrada." }: EntityGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <EntityCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!entities || entities.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {entities.map((entity, index) => (
        <EntityCard key={entity.id} entity={entity} index={index} />
      ))}
    </div>
  )
}
