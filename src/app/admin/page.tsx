"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen,
  Scroll,
  ImageIcon,
  TrendingUp,
  Eye,
  Plus,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStories, useEntityCounts } from "@/hooks"
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

const quickActions = [
  {
    label: "Nova História",
    href: "/admin/stories/new",
    icon: BookOpen,
    color: "bg-crimson hover:bg-crimson/90",
  },
  {
    label: "Nova Entidade",
    href: "/admin/wiki/new",
    icon: Scroll,
    color: "bg-gold hover:bg-gold/90 text-black",
  },
  {
    label: "Upload Mídia",
    href: "/admin/media",
    icon: ImageIcon,
    color: "bg-secondary hover:bg-secondary/90",
  },
]

export default function AdminDashboard() {
  const { data: storiesData } = useStories({ limit: 5 })
  const { data: entityCounts } = useEntityCounts()

  const totalEntities = entityCounts
    ? Object.values(entityCounts).reduce((sum, count) => sum + count, 0)
    : 0

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo do Imperial Codex
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-card/50 border-crimson/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total de Histórias
                  </p>
                  <p className="text-4xl font-bold text-crimson">
                    {storiesData?.stories?.length ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-crimson/10">
                  <BookOpen className="w-8 h-8 text-crimson" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/50 border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Entidades Wiki
                  </p>
                  <p className="text-4xl font-bold text-gold">{totalEntities}</p>
                </div>
                <div className="p-3 rounded-lg bg-gold/10">
                  <Scroll className="w-8 h-8 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Visualizações
                  </p>
                  <p className="text-4xl font-bold">
                    {storiesData?.stories?.reduce(
                      (sum, s) => sum + (s.view_count ?? 0),
                      0
                    ) ?? 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <Eye className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <Button className={action.color}>
                  <Plus className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Stories */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-crimson" />
              Histórias Recentes
            </CardTitle>
            <Link href="/admin/stories">
              <Button variant="ghost" size="sm">
                Ver todas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {storiesData?.stories && storiesData.stories.length > 0 ? (
              <ul className="space-y-3">
                {storiesData.stories.slice(0, 5).map((story) => (
                  <li key={story.id}>
                    <Link
                      href={`/admin/stories/${story.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{story.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {story.created_at
                            ? new Date(story.created_at).toLocaleDateString("pt-BR")
                            : ""}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          story.status === "published"
                            ? "border-green-500/50 text-green-400"
                            : "border-yellow-500/50 text-yellow-400"
                        }
                      >
                        {story.status === "published" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma história ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Entity Counts */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-gold" />
              Entidades por Tipo
            </CardTitle>
            <Link href="/admin/wiki">
              <Button variant="ghost" size="sm">
                Ver todas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {entityCounts ? (
              <ul className="space-y-3">
                {Object.entries(entityCounts).map(([type, count]) => (
                  <li
                    key={type}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <span className="font-medium">
                      {typeLabels[type as WikiEntityType] || type}
                    </span>
                    <Badge variant="outline" className="border-gold/50 text-gold">
                      {count}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma entidade ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
