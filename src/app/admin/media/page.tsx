"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Grid,
  ImageIcon,
  List,
  Loader2,
  MoreVertical,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileUploadDialog } from "@/components/ui/file-upload-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteMediaRecord, getMediaRecords } from "@/lib/queries/media";

export default function AdminMediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["media"],
    queryFn: () => getMediaRecords(100, 0),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMediaRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Arquivo excluído!");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  const handleCopy = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("URL copiada!");
    setTimeout(() => setCopiedUrl(null), 2000);
  }, []);

  const handleUploadComplete = useCallback(
    (url: string) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setShowUploadDialog(false);
      toast.success("Arquivo enviado com sucesso!");
    },
    [queryClient],
  );

  const filteredMedia = data?.media?.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return "📁";
    if (mimeType.startsWith("image/")) return null; // Will show actual image
    if (mimeType === "application/pdf") return "📄";
    if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
    return "📁";
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-purple-400" />
            Mídia
          </h1>
          <p className="text-muted-foreground">
            Gerencie imagens e arquivos do Centuriões Verbum
          </p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-500 hover:bg-purple-500/90 w-full sm:w-auto">
              <Upload className="w-4 h-4 mr-2" />
              Fazer Upload
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload de Arquivos</DialogTitle>
              <DialogDescription>
                Faça upload de imagens e documentos para usar no site.
              </DialogDescription>
            </DialogHeader>
            <FileUploadDialog
              onUploadComplete={handleUploadComplete}
              folder="content"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar arquivos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-border/50"
          />
        </div>
        <div className="flex items-center justify-end gap-1 bg-card/50 border border-border/50 rounded-lg p-1 self-end sm:self-auto">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
              : "space-y-2"
          }
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className={
                viewMode === "grid" ? "aspect-square rounded-lg" : "h-16"
              }
            />
          ))}
        </div>
      ) : filteredMedia && filteredMedia.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((item) => {
              const icon = getFileIcon(item.mime_type);
              const isImage = item.mime_type?.startsWith("image/");

              return (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-card border border-border/50 hover:border-purple-500/50 transition-colors"
                >
                  {isImage ? (
                    <Image
                      src={item.url}
                      alt={item.alt_text || item.filename}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl bg-secondary/50">
                      {icon}
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-xs text-white truncate font-medium">
                        {item.filename}
                      </p>
                      <p className="text-xs text-white/60">
                        {formatFileSize(item.size_bytes)}
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        onClick={() => handleCopy(item.url)}
                      >
                        {copiedUrl === item.url ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7"
                        asChild
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-7 w-7"
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMedia.map((item) => {
              const icon = getFileIcon(item.mime_type);
              const isImage = item.mime_type?.startsWith("image/");

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-purple-500/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 relative rounded overflow-hidden bg-secondary flex-shrink-0">
                    {isImage ? (
                      <Image
                        src={item.url}
                        alt={item.alt_text || item.filename}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {icon}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.mime_type || "Desconhecido"} •{" "}
                      {formatFileSize(item.size_bytes)}
                    </p>
                  </div>

                  {/* Date */}
                  <span className="text-sm text-muted-foreground hidden md:block">
                    {formatDate(item.created_at)}
                  </span>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCopy(item.url)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar URL
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir em nova aba
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery
                ? "Nenhum resultado encontrado"
                : "Nenhum arquivo ainda"}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              {searchQuery
                ? `Não encontramos arquivos com "${searchQuery}".`
                : "Faça upload de imagens para usar em suas histórias e entidades wiki. Os arquivos serão armazenados de forma segura no Supabase Storage."}
            </p>
            {!searchQuery && (
              <Button
                className="bg-purple-500 hover:bg-purple-500/90"
                onClick={() => setShowUploadDialog(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Fazer Upload
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-card/30 border border-border/50">
        <h4 className="font-semibold mb-2">💡 Dica</h4>
        <p className="text-sm text-muted-foreground">
          Para usar uma imagem, faça o upload e copie a URL. Depois, cole a URL
          no campo de imagem ao criar ou editar uma história ou entidade wiki.
          Você também pode arrastar e soltar arquivos diretamente no editor.
        </p>
      </div>
    </div>
  );
}
