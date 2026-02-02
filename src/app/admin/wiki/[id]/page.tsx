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
import { use, useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateWikiEntity, useWikiEntity } from "@/hooks";
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

interface EditWikiPageProps {
  params: Promise<{ id: string }>;
}

export default function EditWikiPage({ params }: EditWikiPageProps) {
  const { id } = use(params);
  const router = useRouter();

  // State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [entityType, setEntityType] = useState<WikiEntityType>("character");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [xCoord, setXCoord] = useState<number | null>(null);
  const [yCoord, setYCoord] = useState<number | null>(null);
  const [zCoord, setZCoord] = useState<number | null>(null);
  const [mapLayer, setMapLayer] = useState("");
  const [autoSlug, setAutoSlug] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Queries and mutations
  const { data: entity, isLoading, error } = useWikiEntity(id, true);
  const updateWikiEntity = useUpdateWikiEntity();

  // Load entity data
  useEffect(() => {
    if (entity) {
      console.log("🔍 Entidade carregada:", {
        name: entity.name,
        entity_type: entity.entity_type,
        entity_type_typeof: typeof entity.entity_type,
      });
      setName(entity.name);
      setSlug(entity.slug);
      setEntityType(entity.entity_type);
      setShortDescription(entity.short_description || "");
      setFullDescription(entity.full_description || "");
      setImageUrl(entity.image_url || "");
      setXCoord(entity.x_coord);
      setYCoord(entity.y_coord);
      setZCoord(entity.z_coord);
      setMapLayer(entity.map_layer || "");
    }
  }, [entity]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (autoSlug) {
      setSlug(slugify(value));
    }
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

    const loadingToast = toast.loading("Salvando...");

    try {
      await updateWikiEntity.mutateAsync({
        id,
        updates: {
          name: name.trim(),
          slug: finalSlug,
          entity_type: entityType,
          short_description: shortDescription.trim() || null,
          full_description: fullDescription.trim() || null,
          image_url: imageUrl.trim() || null,
          x_coord: xCoord,
          y_coord: yCoord,
          z_coord: zCoord,
          map_layer: mapLayer.trim() || null,
        },
      });

      toast.dismiss(loadingToast);
      toast.success("Entidade salva com sucesso!");
      router.push("/admin/wiki");
    } catch (error: unknown) {
      console.error("Erro ao salvar:", error);
      toast.dismiss(loadingToast);

      if (error instanceof Error) {
        if (
          error.message.includes("duplicate") ||
          error.message.includes("unique")
        ) {
          toast.error("Já existe uma entidade com este slug.");
        } else {
          toast.error(`Erro: ${error.message}`);
        }
      } else {
        toast.error("Erro ao salvar entidade");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (url: string) => {
    setImageUrl(url);
    setShowUploadDialog(false);
    toast.success("Imagem atualizada!");
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

  if (error || !entity) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Entidade não encontrada</h2>
        <Link href="/admin/wiki">
          <Button variant="outline">Voltar ao Wiki</Button>
        </Link>
      </div>
    );
  }

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
          Editar Entidade
        </h1>
        <p className="text-muted-foreground">Editando: {entity.name}</p>
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
                    key={`${entity?.id}-${entityType}`}
                    value={entityType}
                    onValueChange={(v) => setEntityType(v as WikiEntityType)}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(entityTypeLabels).map(
                        ([value, label]) => {
                          const TypeIcon =
                            entityTypeIcons[value as WikiEntityType] || Users;
                          return (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center gap-2">
                                <TypeIcon className="w-4 h-4" />
                                {label}
                              </div>
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
                  {xCoord !== null && yCoord !== null && (
                    <span className="ml-auto text-sm font-normal text-gold/70">
                      ({xCoord}, {yCoord})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Defina coordenadas para exibir esta entidade no mapa
                  interativo do Centuriões Verbum.
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
                {xCoord !== null && yCoord !== null && (
                  <div className="pt-4 border-t border-border/50">
                    <Link href="/map" target="_blank">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-gold/50 text-gold hover:bg-gold/10"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Ver no Mapa
                      </Button>
                    </Link>
                  </div>
                )}
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
                  {imageUrl && (
                    <div className="mt-4">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full aspect-square object-cover rounded-lg border border-border/50"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold/90 text-black"
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
              href={`/wiki/${entity.entity_type}/${entity.slug}`}
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
    </div>
  );
}
