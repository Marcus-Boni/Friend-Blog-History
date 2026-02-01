"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Scroll,
  Users,
  MapPin,
  Calendar,
  Package,
  Lightbulb,
  Building2,
  Search,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Header, Footer } from "@/components/layout"
import { EntityGrid } from "@/components/wiki"
import { useWikiEntities, useEntityCounts } from "@/hooks"
import type { WikiEntityType } from "@/types/database.types"

const entityTypes: { value: WikiEntityType; label: string; icon: typeof Users; description: string }[] = [
  { value: "character", label: "Personagens", icon: Users, description: "Heróis, vilões e figuras" },
  { value: "location", label: "Locais", icon: MapPin, description: "Reinos, cidades e lugares" },
  { value: "event", label: "Eventos", icon: Calendar, description: "Acontecimentos históricos" },
  { value: "fact", label: "Fatos", icon: Scroll, description: "Informações importantes" },
  { value: "item", label: "Itens", icon: Package, description: "Objetos e artefatos" },
  { value: "concept", label: "Conceitos", icon: Lightbulb, description: "Ideias e filosofias" },
  { value: "organization", label: "Organizações", icon: Building2, description: "Grupos e facções" },
]

function WikiContent() {
  const searchParams = useSearchParams()
  const initialType = searchParams.get("type") as WikiEntityType | null
  const [selectedType, setSelectedType] = useState<WikiEntityType | null>(initialType)
  const [searchQuery, setSearchQuery] = useState("")

  const { data: countsData } = useEntityCounts()
  const { data, isLoading } = useWikiEntities({
    type: selectedType || undefined,
    search: searchQuery || undefined,
    limit: 50,
  })

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge
              variant="outline"
              className="mb-4 border-gold/50 text-gold"
            >
              ENCICLOPÉDIA
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-gold">Codex</span> Wiki
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              A enciclopédia completa do universo Imperial. Descubra personagens, 
              locais, eventos e tudo que compõe estas narrativas épicas.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar entidades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card/50 border-border/50 focus:border-gold/50"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      {!selectedType && !searchQuery && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {entityTypes.map((type, index) => {
                const Icon = type.icon
                const count = countsData?.[type.value] ?? 0
                return (
                  <motion.div
                    key={type.value}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                      className="w-full text-left"
                    >
                      <Card className="group bg-card/50 border-border/50 hover:border-gold/50 transition-all duration-300 cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-2 rounded-lg bg-gold/10 text-gold group-hover:bg-gold/20 transition-colors">
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-gold/30">
                              {String(count).padStart(2, "0")}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mb-1 group-hover:text-gold transition-colors">
                            {type.label}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Filter bar when type selected */}
      {(selectedType || searchQuery) && (
        <section className="pb-8 sticky top-16 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {selectedType && (
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedType(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Todas as categorias
                    <ChevronRight className="w-4 h-4 mx-2" />
                  </Button>
                )}
                <Badge variant="outline" className="border-gold/50 text-gold">
                  {selectedType
                    ? entityTypes.find((t) => t.value === selectedType)?.label
                    : `Busca: "${searchQuery}"`}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {data?.entities?.length ?? 0} resultados
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Entities Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {selectedType || searchQuery && (
            <EntityGrid
              entities={data?.entities}
              isLoading={isLoading}
              emptyMessage={
                searchQuery
                  ? `Nenhuma entidade encontrada para "${searchQuery}".`
                  : "Nenhuma entidade nesta categoria."
              }
            />
          )}
        </div>
      </section>
    </>
  )
}

function WikiLoading() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-lg mx-auto mb-8" />
          <Skeleton className="h-12 w-full max-w-md mx-auto" />
        </div>
      </section>
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default function WikiPage() {
  return (
    <div className="min-h-screen bg-imperial-gradient">
      <Header />

      <Suspense fallback={<WikiLoading />}>
        <WikiContent />
      </Suspense>

      <Footer />
    </div>
  )
}
