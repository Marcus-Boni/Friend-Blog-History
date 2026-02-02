"use client";

import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileUp,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUploadDialog } from "@/components/ui/file-upload-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateChapter,
  useDeleteChapter,
  useStoryWithChapters,
  useUpdateChapter,
  useUpdateStory,
} from "@/hooks";
import type {
  Chapter,
  StoryCategory,
  StoryStatus,
} from "@/types/database.types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ChapterFormData {
  id?: string;
  title: string;
  content: string;
  chapter_order: number;
  isNew?: boolean;
  isOpen?: boolean;
}

interface EditStoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = use(params);
  const router = useRouter();

  // State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [category, setCategory] = useState<StoryCategory | null>("tale");
  const [status, setStatus] = useState<StoryStatus | null>("draft");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [autoSlug, setAutoSlug] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chapters, setChapters] = useState<ChapterFormData[]>([]);
  const [deleteChapterId, setDeleteChapterId] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Queries and mutations
  const { data: story, isLoading, error } = useStoryWithChapters(id, true);
  const updateStory = useUpdateStory();
  const createChapter = useCreateChapter();
  const updateChapter = useUpdateChapter();
  const deleteChapterMutation = useDeleteChapter();

  // Load story data
  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setSlug(story.slug);
      setSynopsis(story.synopsis || "");
      setCategory(story.category || "tale");
      setStatus(story.status || "draft");
      setCoverImageUrl(story.cover_image_url || "");
      setFeatured(story.featured || false);
      setChapters(
        (story.chapters || []).map((ch: Chapter) => ({
          id: ch.id,
          title: ch.title,
          content: ch.content || "",
          chapter_order: ch.chapter_order,
          isNew: false,
          isOpen: false,
        })),
      );
    }
  }, [story]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (autoSlug) {
      setSlug(slugify(value));
    }
  };

  const handleAddChapter = () => {
    const newOrder =
      chapters.length > 0
        ? Math.max(...chapters.map((c) => c.chapter_order)) + 1
        : 1;
    setChapters([
      ...chapters,
      {
        title: `Capítulo ${newOrder}`,
        content: "",
        chapter_order: newOrder,
        isNew: true,
        isOpen: true,
      },
    ]);
  };

  const handleUpdateChapterField = (
    index: number,
    field: keyof ChapterFormData,
    value: string | number | boolean,
  ) => {
    setChapters((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch)),
    );
  };

  const handleMoveChapter = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === chapters.length - 1)
    ) {
      return;
    }

    const newChapters = [...chapters];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newChapters[index].chapter_order;
    newChapters[index].chapter_order = newChapters[targetIndex].chapter_order;
    newChapters[targetIndex].chapter_order = temp;
    [newChapters[index], newChapters[targetIndex]] = [
      newChapters[targetIndex],
      newChapters[index],
    ];
    setChapters(newChapters);
  };

  const handleRemoveChapter = (index: number) => {
    const chapter = chapters[index];
    if (chapter.id) {
      setDeleteChapterId(chapter.id);
    } else {
      setChapters((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const confirmDeleteChapter = async () => {
    if (!deleteChapterId) return;

    try {
      await deleteChapterMutation.mutateAsync(deleteChapterId);
      setChapters((prev) => prev.filter((ch) => ch.id !== deleteChapterId));
      toast.success("Capítulo excluído!");
      setDeleteChapterId(null);
    } catch (error) {
      toast.error("Erro ao excluir capítulo");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      toast.error("Não foi possível gerar um slug válido");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const loadingToast = toast.loading("Salvando...");

    try {
      // Update story
      await updateStory.mutateAsync({
        id,
        updates: {
          title: title.trim(),
          slug: finalSlug,
          synopsis: synopsis.trim() || null,
          category: category || "tale",
          status: status || "draft",
          cover_image_url: coverImageUrl.trim() || null,
          featured,
        },
      });

      // Save chapters
      for (const chapter of chapters) {
        if (chapter.isNew) {
          await createChapter.mutateAsync({
            story_id: id,
            title: chapter.title,
            content: chapter.content,
            chapter_order: chapter.chapter_order,
          });
        } else if (chapter.id) {
          await updateChapter.mutateAsync({
            id: chapter.id,
            updates: {
              title: chapter.title,
              content: chapter.content,
              chapter_order: chapter.chapter_order,
            },
          });
        }
      }

      toast.dismiss(loadingToast);
      toast.success("História salva com sucesso!");
      router.push("/admin/stories");
    } catch (error: unknown) {
      console.error("Erro ao salvar:", error);
      toast.dismiss(loadingToast);

      if (error instanceof Error) {
        if (
          error.message.includes("duplicate") ||
          error.message.includes("unique")
        ) {
          toast.error("Já existe uma história com este slug.");
        } else {
          toast.error(`Erro: ${error.message}`);
        }
      } else {
        toast.error("Erro ao salvar história");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (url: string) => {
    setCoverImageUrl(url);
    setShowUploadDialog(false);
    toast.success("Imagem de capa atualizada!");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">História não encontrada</h2>
        <Link href="/admin/stories">
          <Button variant="outline">Voltar às histórias</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/stories">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Editar História</h1>
        <p className="text-muted-foreground">Editando: {story.title}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Ex: A Queda do Império"
                    className="bg-secondary/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug">Slug *</Label>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="auto-slug"
                        className="text-xs text-muted-foreground"
                      >
                        Auto
                      </Label>
                      <Switch
                        id="auto-slug"
                        checked={autoSlug}
                        onCheckedChange={setAutoSlug}
                      />
                    </div>
                  </div>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => {
                      setAutoSlug(false);
                      setSlug(e.target.value);
                    }}
                    placeholder="a-queda-do-imperio"
                    className="bg-secondary/50 font-mono"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="synopsis">Sinopse</Label>
                  <Textarea
                    id="synopsis"
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    placeholder="Uma breve descrição da história..."
                    className="bg-secondary/50 min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Capítulos ({chapters.length})
                  </span>
                  <Button type="button" onClick={handleAddChapter} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Capítulo
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {chapters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum capítulo ainda.</p>
                    <p className="text-sm">
                      Adicione capítulos para dar vida à sua história.
                    </p>
                  </div>
                ) : (
                  chapters.map((chapter, index) => (
                    <Collapsible
                      key={chapter.id || `new-${index}`}
                      open={chapter.isOpen}
                      onOpenChange={(open) =>
                        handleUpdateChapterField(index, "isOpen", open)
                      }
                    >
                      <div className="border border-border/50 rounded-lg overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center gap-2 p-3 bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
                            <GripVertical className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-sm text-muted-foreground">
                              #{chapter.chapter_order}
                            </span>
                            <span className="font-medium flex-1">
                              {chapter.title || "Sem título"}
                            </span>
                            {chapter.isNew && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                                Novo
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveChapter(index, "up");
                                }}
                                disabled={index === 0}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveChapter(index, "down");
                                }}
                                disabled={index === chapters.length - 1}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveChapter(index);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            {chapter.isOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 space-y-4 border-t border-border/50">
                            <div className="space-y-2">
                              <Label>Título do Capítulo</Label>
                              <Input
                                value={chapter.title}
                                onChange={(e) =>
                                  handleUpdateChapterField(
                                    index,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                placeholder="Ex: O Início"
                                className="bg-secondary/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Conteúdo</Label>
                              <RichTextEditor
                                value={chapter.content}
                                onChange={(value) =>
                                  handleUpdateChapterField(
                                    index,
                                    "content",
                                    value,
                                  )
                                }
                                placeholder="Escreva o conteúdo do capítulo..."
                              />
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Mídia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="cover">Imagem de Capa</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cover"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="bg-secondary/50"
                    />
                    <Dialog
                      open={showUploadDialog}
                      onOpenChange={setShowUploadDialog}
                    >
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline">
                          <FileUp className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Upload de Imagem</DialogTitle>
                          <DialogDescription>
                            Faça upload de uma imagem ou documento para usar
                            como capa.
                          </DialogDescription>
                        </DialogHeader>
                        <FileUploadDialog
                          onUploadComplete={handleFileUpload}
                          folder="covers"
                          accept="image/*"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  {coverImageUrl && (
                    <div className="mt-4">
                      <img
                        src={coverImageUrl}
                        alt="Preview da capa"
                        className="max-w-xs rounded-lg border border-border/50"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Publicação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={status || "draft"}
                    onValueChange={(v) => setStatus(v as StoryStatus)}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={category || "tale"}
                    onValueChange={(v) => setCategory(v as StoryCategory)}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tale">Conto</SelectItem>
                      <SelectItem value="chronicle">Crônica</SelectItem>
                      <SelectItem value="dream">Sonho</SelectItem>
                      <SelectItem value="idea">Ideia</SelectItem>
                      <SelectItem value="thought">Pensamento</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Destaque</Label>
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-crimson hover:bg-crimson/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>

            <Link
              href={`/stories/${story.slug}`}
              target="_blank"
              className="block"
            >
              <Button type="button" variant="outline" className="w-full">
                Visualizar no Site
              </Button>
            </Link>
          </div>
        </div>
      </form>

      {/* Delete Chapter Dialog */}
      <Dialog
        open={!!deleteChapterId}
        onOpenChange={() => setDeleteChapterId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir capítulo?</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este capítulo? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteChapterId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteChapter}
              disabled={deleteChapterMutation.isPending}
            >
              {deleteChapterMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
