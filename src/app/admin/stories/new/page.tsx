"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  FileUp,
  BookOpen,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { FileUploadDialog } from "@/components/ui/file-upload-dialog"
import { DocumentImportDialog } from "@/components/ui/document-import-dialog"
import { useCreateStory, useCreateChapter } from "@/hooks"
import { toast } from "sonner"
import type { StoryCategory, StoryStatus } from "@/types/database.types"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

interface ChapterFormData {
  title: string
  content: string
  chapter_order: number
  isOpen?: boolean
}

export default function NewStoryPage() {
  const router = useRouter()
  const createStory = useCreateStory()
  const createChapter = useCreateChapter()

  // Story state
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [synopsis, setSynopsis] = useState("")
  const [category, setCategory] = useState<StoryCategory>("tale")
  const [status, setStatus] = useState<StoryStatus>("draft")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [featured, setFeatured] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Chapters state
  const [chapters, setChapters] = useState<ChapterFormData[]>([])

  // Dialogs state
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (autoSlug) {
      setSlug(slugify(value))
    }
  }

  const handleAddChapter = () => {
    const newOrder = chapters.length > 0 ? Math.max(...chapters.map((c) => c.chapter_order)) + 1 : 1
    setChapters([
      ...chapters,
      {
        title: `Capítulo ${newOrder}`,
        content: "",
        chapter_order: newOrder,
        isOpen: true,
      },
    ])
  }

  const handleUpdateChapterField = (
    index: number,
    field: keyof ChapterFormData,
    value: string | number | boolean
  ) => {
    setChapters((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch))
    )
  }

  const handleMoveChapter = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === chapters.length - 1)
    ) {
      return
    }

    const newChapters = [...chapters]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    const temp = newChapters[index].chapter_order
    newChapters[index].chapter_order = newChapters[targetIndex].chapter_order
    newChapters[targetIndex].chapter_order = temp
    ;[newChapters[index], newChapters[targetIndex]] = [
      newChapters[targetIndex],
      newChapters[index],
    ]
    setChapters(newChapters)
  }

  const handleRemoveChapter = (index: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImportChapters = (importedChapters: { title: string; content: string; order: number }[]) => {
    const startOrder = chapters.length > 0 ? Math.max(...chapters.map((c) => c.chapter_order)) + 1 : 1
    
    const newChapters = importedChapters.map((ch, idx) => ({
      title: ch.title,
      content: ch.content,
      chapter_order: startOrder + idx,
      isOpen: false,
    }))

    setChapters([...chapters, ...newChapters])
    setShowImportDialog(false)
  }

  const handleFileUpload = (url: string) => {
    setCoverImageUrl(url)
    setShowUploadDialog(false)
    toast.success("Imagem de capa adicionada!")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("O título é obrigatório")
      return
    }

    const finalSlug = slug.trim() || slugify(title)
    if (!finalSlug) {
      toast.error("Não foi possível gerar um slug válido")
      return
    }

    if (isSubmitting) return
    setIsSubmitting(true)

    const loadingToast = toast.loading("Criando história...")

    try {
      // Create story
      const result = await createStory.mutateAsync({
        title: title.trim(),
        slug: finalSlug,
        synopsis: synopsis.trim() || undefined,
        category,
        status,
        cover_image_url: coverImageUrl.trim() || undefined,
        featured,
      })

      // Create chapters if any
      if (chapters.length > 0 && result.id) {
        for (const chapter of chapters) {
          await createChapter.mutateAsync({
            story_id: result.id,
            title: chapter.title,
            content: chapter.content,
            chapter_order: chapter.chapter_order,
          })
        }
      }

      toast.dismiss(loadingToast)
      toast.success("História criada com sucesso!")
      router.push("/admin/stories")
    } catch (error: unknown) {
      console.error("Erro ao criar história:", error)
      toast.dismiss(loadingToast)

      if (error instanceof Error) {
        if (error.message.includes("Not authenticated")) {
          toast.error("Você precisa estar logado para criar histórias")
        } else if (error.message.includes("duplicate") || error.message.includes("unique")) {
          toast.error("Já existe uma história com este slug. Escolha outro slug.")
        } else if (error.message.includes("violates row-level security")) {
          toast.error("Sem permissão. Verifique se você é um administrador.")
        } else {
          toast.error(`Erro: ${error.message}`)
        }
      } else {
        toast.error("Erro desconhecido ao criar história")
      }
    } finally {
      setIsSubmitting(false)
    }
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
        <h1 className="text-3xl font-bold">Nova História</h1>
        <p className="text-muted-foreground">
          Crie uma nova história para o Centuriões Verbum
        </p>
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
                      <Label htmlFor="auto-slug" className="text-xs text-muted-foreground">
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
                      setAutoSlug(false)
                      setSlug(e.target.value)
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

            {/* Chapters */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Capítulos ({chapters.length})
                  </span>
                  <div className="flex gap-2">
                    <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Importar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Importar Capítulos</DialogTitle>
                          <DialogDescription>
                            Importe capítulos de um arquivo de texto ou cole o conteúdo diretamente.
                          </DialogDescription>
                        </DialogHeader>
                        <DocumentImportDialog onImportComplete={handleImportChapters} />
                      </DialogContent>
                    </Dialog>
                    <Button type="button" onClick={handleAddChapter} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {chapters.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum capítulo ainda.</p>
                    <p className="text-sm">
                      Adicione capítulos manualmente ou importe de um arquivo.
                    </p>
                  </div>
                ) : (
                  chapters.map((chapter, index) => (
                    <Collapsible
                      key={`chapter-${index}`}
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
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMoveChapter(index, "up")
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
                                  e.stopPropagation()
                                  handleMoveChapter(index, "down")
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
                                  e.stopPropagation()
                                  handleRemoveChapter(index)
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
                                  handleUpdateChapterField(index, "title", e.target.value)
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
                                  handleUpdateChapterField(index, "content", value)
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

            {/* Media */}
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
                    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
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
                            Faça upload de uma imagem para usar como capa.
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
                  <Select value={status} onValueChange={(v) => setStatus(v as StoryStatus)}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
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
                  <Select value={category} onValueChange={(v) => setCategory(v as StoryCategory)}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
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
              disabled={isSubmitting || createStory.isPending}
            >
              {isSubmitting || createStory.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Criar História
                </>
              )}
            </Button>

            {/* Info */}
            <div className="p-4 rounded-lg bg-card/30 border border-border/50">
              <h4 className="font-semibold mb-2 text-sm">💡 Dicas</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Você pode adicionar capítulos agora ou depois de criar</li>
                <li>• Use "Importar" para trazer texto de arquivos</li>
                <li>• Histórias em rascunho não aparecem no site público</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
