"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteStory, useStories } from "@/hooks";
import type { Story, StoryCategory } from "@/types/database.types";

const categoryLabels: Record<StoryCategory, string> = {
  dream: "Sonho",
  idea: "Ideia",
  thought: "Pensamento",
  tale: "Conto",
  chronicle: "Crônica",
  other: "Outro",
};

export default function AdminStoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Story | null>(null);

  const { data, isLoading } = useStories({ limit: 100 });
  const deleteStory = useDeleteStory();

  const filteredStories = data?.stories?.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteStory.mutateAsync(deleteTarget.id);
      toast.success("História excluída com sucesso!");
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Erro ao excluir história");
      console.error(error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-crimson" />
            Histórias
          </h1>
          <p className="text-muted-foreground">
            Gerencie todas as histórias do Centuriões Verbum
          </p>
        </div>
        <Link href="/admin/stories/new">
          <Button className="bg-crimson hover:bg-crimson/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova História
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar histórias..."
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
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredStories && filteredStories.length > 0 ? (
              filteredStories.map((story) => (
                <TableRow key={story.id} className="hover:bg-card/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {story.featured && (
                        <Badge className="bg-gold text-black text-xs">★</Badge>
                      )}
                      <span className="font-medium">{story.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {story.category ? categoryLabels[story.category] : "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        story.status === "published"
                          ? "border-green-500/50 text-green-400"
                          : story.status === "archived"
                            ? "border-zinc-500/50 text-zinc-400"
                            : "border-yellow-500/50 text-yellow-400"
                      }
                    >
                      {story.status === "published"
                        ? "Publicado"
                        : story.status === "archived"
                          ? "Arquivado"
                          : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {story.view_count ?? 0}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {story.created_at
                      ? new Date(story.created_at).toLocaleDateString("pt-BR")
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
                          <Link href={`/stories/${story.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver no site
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/stories/${story.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(story)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  {searchQuery
                    ? "Nenhuma história encontrada para esta busca"
                    : "Nenhuma história cadastrada ainda"}
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
            <DialogTitle>Excluir história?</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a história "{deleteTarget?.title}"?
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
              disabled={deleteStory.isPending}
            >
              {deleteStory.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
