"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
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
import { useCreateStory } from "@/hooks"
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

export default function NewStoryPage() {
  const router = useRouter()
  const createStory = useCreateStory()

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [synopsis, setSynopsis] = useState("")
  const [category, setCategory] = useState<StoryCategory>("tale")
  const [status, setStatus] = useState<StoryStatus>("draft")
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [featured, setFeatured] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (autoSlug) {
      setSlug(slugify(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !slug) {
      toast.error("Título e slug são obrigatórios")
      return
    }

    try {
      console.log("Tentando criar história:", { title, slug, category, status })
      
      const result = await createStory.mutateAsync({
        title,
        slug,
        synopsis: synopsis || undefined,
        category,
        status,
        cover_image_url: coverImageUrl || undefined,
        featured,
      })
      
      console.log("História criada:", result)
      toast.success("História criada com sucesso!")
      router.push("/admin/stories")
    } catch (error: unknown) {
      console.error("Erro ao criar história:", error)
      
      // Melhor feedback de erro
      if (error instanceof Error) {
        if (error.message.includes("Not authenticated")) {
          toast.error("Você precisa estar logado para criar histórias")
        } else if (error.message.includes("duplicate")) {
          toast.error("Já existe uma história com este slug")
        } else if (error.message.includes("violates row-level security")) {
          toast.error("Sem permissão. Verifique as políticas RLS no Supabase.")
        } else {
          toast.error(`Erro: ${error.message}`)
        }
      } else {
        toast.error("Erro desconhecido ao criar história")
      }
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
          Crie uma nova história para o Imperial Codex
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

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Mídia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="cover">URL da Imagem de Capa</Label>
                  <Input
                    id="cover"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Cole a URL de uma imagem ou faça upload na seção Mídia
                  </p>
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
              disabled={createStory.isPending}
            >
              {createStory.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar História
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
