"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Scroll,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  MapPin,
  Calendar,
  Package,
  Lightbulb,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useWikiEntities, useDeleteWikiEntity } from "@/hooks"
import { toast } from "sonner"
import type { WikiEntity, WikiEntityType } from "@/types/database.types"

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

export default function AdminWikiPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<WikiEntity | null>(null)
  
  const { data, isLoading } = useWikiEntities({ limit: 100, search: searchQuery || undefined })
  const deleteEntity = useDeleteWikiEntity()

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteEntity.mutateAsync(deleteTarget.id)
      toast.success("Entidade excluída com sucesso!")
      setDeleteTarget(null)
    } catch (error) {
      toast.error("Erro ao excluir entidade")
      console.error(error)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Scroll className="w-8 h-8 text-gold" />
            Wiki
          </h1>
          <p className="text-muted-foreground">
            Gerencie todas as entidades wiki do Imperial Codex
          </p>
        </div>
        <Link href="/admin/wiki/new">
          <Button className="bg-gold hover:bg-gold/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Nova Entidade
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar entidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-border/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/50">
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                </TableRow>
              ))
            ) : data?.entities && data.entities.length > 0 ? (
              data.entities.map((entity) => {
                const Icon = typeIcons[entity.entity_type]
                return (
                  <TableRow key={entity.id} className="hover:bg-card/30">
                    <TableCell>
                      <span className="font-medium">{entity.name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        <Icon className="w-3 h-3 mr-1" />
                        {typeLabels[entity.entity_type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                      {entity.short_description || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {entity.created_at
                        ? new Date(entity.created_at).toLocaleDateString("pt-BR")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/wiki/${entity.entity_type}/${entity.slug}`} target="_blank">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver no site
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/wiki/${entity.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(entity)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  {searchQuery
                    ? "Nenhuma entidade encontrada para esta busca"
                    : "Nenhuma entidade cadastrada ainda"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir entidade?</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a entidade "{deleteTarget?.name}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEntity.isPending}
            >
              {deleteEntity.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
