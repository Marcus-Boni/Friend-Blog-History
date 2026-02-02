"use client";

import {
  ArrowLeft,
  Building2,
  Calendar,
  FileUp,
  Lightbulb,
  Loader2,
  MapPin,
  Package,
  Save,
  Scroll,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateWikiEntity } from "@/hooks";
import type { WikiEntityType } from "@/types/database.types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const entityTypeLabels: Record<WikiEntityType, string> = {
  character: "Personagem",
  location: "Local",
  fact: "Fato",
  event: "Evento",
  item: "Item",
  concept: "Conceito",
  organization: "Organização",
};

const entityTypeIcons: Record<WikiEntityType, typeof Users> = {
  character: Users,
  location: MapPin,
  fact: Scroll,
  event: Calendar,
  item: Package,
  concept: Lightbulb,
  organization: Building2,
};

export default function NewEntityPage() {
  const router = useRouter();
  const createEntity = useCreateWikiEntity();

  // State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [entityType, setEntityType] = useState<WikiEntityType>("character");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Location-specific state
  const [xCoord, setXCoord] = useState<number | null>(null);
  const [yCoord, setYCoord] = useState<number | null>(null);
  const [zCoord, setZCoord] = useState<number | null>(null);
  const [mapLayer, setMapLayer] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (autoSlug) {
      setSlug(slugify(value));
    }
  };

  const handleFileUpload = (url: string) => {
    setImageUrl(url);
    setShowUploadDialog(false);
    toast.success("Imagem adicionada!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("O nome é obrigatório");
      return;
    }

    const finalSlug = slug.trim() || slugify(name);
    if (!finalSlug) {
      toast.error("Não foi possível gerar um slug válido");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    const loadingToast = toast.loading("Salvando entidade...");

    try {
      await createEntity.mutateAsync({
        name: name.trim(),
        slug: finalSlug,
        entity_type: entityType,
        short_description: shortDescription.trim() || undefined,
        full_description: fullDescription.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
        x_coord: xCoord ?? undefined,
        y_coord: yCoord ?? undefined,
        z_coord: zCoord ?? undefined,
        map_layer: mapLayer.trim() || undefined,
      });
      toast.dismiss(loadingToast);
      toast.success("Entidade criada com sucesso!");
      router.push("/admin/wiki");
    } catch (error: unknown) {
      console.error("Erro ao criar entidade:", error);
      toast.dismiss(loadingToast);

      if (error instanceof Error) {
        if (error.message.includes("Not authenticated")) {
          toast.error("Você precisa estar logado para criar entidades");
        } else if (
          error.message.includes("duplicate") ||
          error.message.includes("unique")
        ) {
          toast.error(
            "Já existe uma entidade com este slug. Escolha outro slug.",
          );
        } else if (error.message.includes("violates row-level security")) {
          toast.error("Sem permissão. Verifique se você é administrador.");
        } else {
          toast.error(`Erro: ${error.message}`);
        }
      } else {
        toast.error("Erro desconhecido ao criar entidade");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safely get icon with fallback to prevent undefined component errors
  const Icon = entityTypeIcons[entityType] || Users;

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
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Icon className="w-8 h-8 text-gold" />
          Nova Entidade Wiki
        </h1>
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
                    placeholder="Ex: Imperador Valdrius"
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
                    placeholder="imperador-valdrius"
                    className="bg-secondary/50 font-mono"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Entidade</Label>
                  <Select
                    value={entityType}
                    onValueChange={(v) => setEntityType(v as WikiEntityType)}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(entityTypeLabels).map(
                        ([value, label]) => {
                          const TypeIcon =
                            entityTypeIcons[value as WikiEntityType] || Users;
                          return (
                            <SelectItem key={value} value={value}>
                              <span className="flex items-center gap-2">
                                <TypeIcon className="w-4 h-4" />
                                {label}
                              </span>
                            </SelectItem>
                          );
                        },
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Descrição Curta</Label>
                  <Textarea
                    id="shortDescription"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Uma breve descrição..."
                    className="bg-secondary/50 min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Descrição Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  value={fullDescription}
                  onChange={setFullDescription}
                  placeholder="Escreva a descrição completa da entidade..."
                  minHeight="400px"
                />
              </CardContent>
            </Card>

            {/* Map Coordinates - Available for all entity types */}
            <Card className="bg-card/50 border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  Posição no Mapa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Defina coordenadas para exibir esta entidade no mapa
                  interativo.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="xCoord" className="text-crimson">
                      X
                    </Label>
                    <Input
                      id="xCoord"
                      type="number"
                      step="0.1"
                      min="-256"
                      max="256"
                      value={xCoord ?? ""}
                      onChange={(e) =>
                        setXCoord(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      placeholder="0"
                      className="bg-secondary/50 focus:border-crimson"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yCoord" className="text-gold">
                      Y
                    </Label>
                    <Input
                      id="yCoord"
                      type="number"
                      step="0.1"
                      min="-256"
                      max="256"
                      value={yCoord ?? ""}
                      onChange={(e) =>
                        setYCoord(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      placeholder="0"
                      className="bg-secondary/50 focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zCoord" className="text-purple-400">
                      Z (profundidade)
                    </Label>
                    <Input
                      id="zCoord"
                      type="number"
                      step="0.1"
                      value={zCoord ?? ""}
                      onChange={(e) =>
                        setZCoord(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      placeholder="0"
                      className="bg-secondary/50 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mapLayer">Camada do Mapa</Label>
                  <Input
                    id="mapLayer"
                    value={mapLayer}
                    onChange={(e) => setMapLayer(e.target.value)}
                    placeholder="Ex: território-norte, subterrâneo"
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use camadas para organizar diferentes regiões ou dimensões.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Imagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL da Imagem</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="bg-secondary/50"
                    />
                    <Dialog
                      open={showUploadDialog}
                      onOpenChange={setShowUploadDialog}
                    >
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon">
                          <FileUp className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Upload de Imagem</DialogTitle>
                          <DialogDescription>
                            Faça upload de uma imagem para a entidade.
                          </DialogDescription>
                        </DialogHeader>
                        <FileUploadDialog
                          onUploadComplete={handleFileUpload}
                          folder="wiki"
                          accept="image/*"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {imageUrl && (
                  <div className="mt-4">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full aspect-square object-cover rounded-lg border border-border/50"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold/90 text-black"
              disabled={isSubmitting || createEntity.isPending}
            >
              {isSubmitting || createEntity.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Criar Entidade
                </>
              )}
            </Button>

            {/* Info */}
            <div className="p-4 rounded-lg bg-card/30 border border-border/50">
              <h4 className="font-semibold mb-2 text-sm">💡 Dicas</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  • O tipo de entidade define como ela é categorizada no wiki
                </li>
                <li>• Locais podem ter coordenadas para futuros mapas</li>
                <li>• Use descrição rica para formatar o conteúdo</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
