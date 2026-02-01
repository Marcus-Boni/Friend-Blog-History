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
import { useCreateWikiEntity } from "@/hooks"
import { toast } from "sonner"
import type { WikiEntityType } from "@/types/database.types"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function NewEntityPage() {
  const router = useRouter()
  const createEntity = useCreateWikiEntity()

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [entityType, setEntityType] = useState<WikiEntityType>("character")
  const [shortDescription, setShortDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [autoSlug, setAutoSlug] = useState(true)
  
  // 3D coordinates for future maps
  const [xCoord, setXCoord] = useState("")
  const [yCoord, setYCoord] = useState("")
  const [zCoord, setZCoord] = useState("")

  const handleNameChange = (value: string) => {
    setName(value)
    if (autoSlug) {
      setSlug(slugify(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !slug) {
      toast.error("Nome e slug são obrigatórios")
      return
    }

    try {
      await createEntity.mutateAsync({
        name,
        slug,
        entity_type: entityType,
        short_description: shortDescription || undefined,
        full_description: fullDescription || undefined,
        image_url: imageUrl || undefined,
        x_coord: xCoord ? Number.parseFloat(xCoord) : undefined,
        y_coord: yCoord ? Number.parseFloat(yCoord) : undefined,
        z_coord: zCoord ? Number.parseFloat(zCoord) : undefined,
      })
      toast.success("Entidade criada com sucesso!")
      router.push("/admin/wiki")
    } catch (error) {
      toast.error("Erro ao criar entidade")
      console.error(error)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/wiki">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nova Entidade Wiki</h1>
        <p className="text-muted-foreground">
          Adicione uma nova entidade ao Codex Wiki
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
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: General Von Strausberg"
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
                    placeholder="general-von-strausberg"
                    className="bg-secondary/50 font-mono"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short-desc">Descrição Curta</Label>
                  <Input
                    id="short-desc"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Uma linha resumindo a entidade"
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-desc">Descrição Completa</Label>
                  <Textarea
                    id="full-desc"
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    placeholder="Descrição detalhada da entidade..."
                    className="bg-secondary/50 min-h-[200px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Coordenadas 3D (Futuro)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Preparado para futura integração com mapas 3D
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="x">X</Label>
                    <Input
                      id="x"
                      type="number"
                      step="any"
                      value={xCoord}
                      onChange={(e) => setXCoord(e.target.value)}
                      placeholder="0.0"
                      className="bg-secondary/50 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="y">Y</Label>
                    <Input
                      id="y"
                      type="number"
                      step="any"
                      value={yCoord}
                      onChange={(e) => setYCoord(e.target.value)}
                      placeholder="0.0"
                      className="bg-secondary/50 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="z">Z</Label>
                    <Input
                      id="z"
                      type="number"
                      step="any"
                      value={zCoord}
                      onChange={(e) => setZCoord(e.target.value)}
                      placeholder="0.0"
                      className="bg-secondary/50 font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Classificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de Entidade *</Label>
                  <Select value={entityType} onValueChange={(v) => setEntityType(v as WikiEntityType)}>
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="character">Personagem</SelectItem>
                      <SelectItem value="location">Local</SelectItem>
                      <SelectItem value="event">Evento</SelectItem>
                      <SelectItem value="fact">Fato</SelectItem>
                      <SelectItem value="item">Item</SelectItem>
                      <SelectItem value="concept">Conceito</SelectItem>
                      <SelectItem value="organization">Organização</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Mídia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="image">URL da Imagem</Label>
                  <Input
                    id="image"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-secondary/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold/90 text-black"
              disabled={createEntity.isPending}
            >
              {createEntity.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Entidade
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
