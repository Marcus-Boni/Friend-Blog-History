"use client"

import { useState } from "react"
import { ImageIcon, Upload, Search, Trash2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function AdminMediaPage() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    toast.success("URL copiada!")
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-purple-400" />
            Mídia
          </h1>
          <p className="text-muted-foreground">
            Gerencie imagens e arquivos do Imperial Codex
          </p>
        </div>
        <Button className="bg-purple-500 hover:bg-purple-500/90">
          <Upload className="w-4 h-4 mr-2" />
          Fazer Upload
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar arquivos..."
            className="pl-10 bg-card/50 border-border/50"
          />
        </div>
      </div>

      {/* Empty State */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum arquivo ainda</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Faça upload de imagens para usar em suas histórias e entidades wiki.
            Os arquivos serão armazenados de forma segura no Supabase Storage.
          </p>
          <Button className="bg-purple-500 hover:bg-purple-500/90">
            <Upload className="w-4 h-4 mr-2" />
            Fazer Upload
          </Button>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="mt-8 p-4 rounded-lg bg-card/30 border border-border/50">
        <h4 className="font-semibold mb-2">💡 Dica</h4>
        <p className="text-sm text-muted-foreground">
          Para usar uma imagem, faça o upload e copie a URL. Depois, cole a URL 
          no campo de imagem ao criar ou editar uma história ou entidade wiki.
        </p>
      </div>
    </div>
  )
}
