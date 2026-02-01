"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileText, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "./button"
import { Label } from "./label"
import { Input } from "./input"
import { Textarea } from "./textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface ImportedChapter {
  title: string
  content: string
  order: number
}

interface DocumentImportDialogProps {
  onImportComplete: (chapters: ImportedChapter[]) => void
}

export function DocumentImportDialog({ onImportComplete }: DocumentImportDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rawContent, setRawContent] = useState("")
  const [chapters, setChapters] = useState<ImportedChapter[]>([])
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [separatorPattern, setSeparatorPattern] = useState("Capítulo")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseChapters = useCallback((text: string, pattern: string) => {
    if (!text.trim()) {
      setChapters([])
      return
    }

    // Try to split by pattern
    const regex = new RegExp(`(${pattern}\\s*\\d*[:\\s-]*[^\\n]*?)(?=\\n)`, "gi")
    const parts = text.split(regex).filter((p) => p.trim())

    if (parts.length <= 1) {
      // No chapters found, treat entire content as one chapter
      setChapters([
        {
          title: "Capítulo 1",
          content: text.trim(),
          order: 1,
        },
      ])
      return
    }

    const importedChapters: ImportedChapter[] = []
    let order = 1

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim()
      
      // Check if this looks like a chapter header
      if (regex.test(part)) {
        const content = parts[i + 1]?.trim() || ""
        if (content) {
          importedChapters.push({
            title: part,
            content,
            order: order++,
          })
          i++ // Skip the content part
        }
      } else if (i === 0 && part) {
        // First part before any chapter header
        importedChapters.push({
          title: "Prólogo",
          content: part,
          order: order++,
        })
      }
    }

    if (importedChapters.length === 0) {
      // Fallback: treat as single chapter
      importedChapters.push({
        title: "Capítulo 1",
        content: text.trim(),
        order: 1,
      })
    }

    setChapters(importedChapters)
  }, [])

  const processFile = async (file: File) => {
    setIsProcessing(true)

    try {
      // For text files, read directly
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text()
        setRawContent(text)
        parseChapters(text, separatorPattern)
        toast.success("Arquivo processado!")
      }
      // For other formats, we need to extract text
      else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        // PDF processing would require a library like pdf.js
        // For now, show a message
        toast.error("PDF: Por favor, copie o texto do PDF e cole no campo de texto abaixo.")
        setRawContent("")
      }
      else if (
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx")
      ) {
        // DOCX processing would require a library like mammoth.js
        // For now, show a message
        toast.error("DOCX: Por favor, copie o texto do documento e cole no campo de texto abaixo.")
        setRawContent("")
      }
      else {
        toast.error("Formato não suportado. Use TXT, ou copie/cole o conteúdo.")
      }
    } catch (error) {
      console.error("Error processing file:", error)
      toast.error("Erro ao processar arquivo")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const handleTextChange = (text: string) => {
    setRawContent(text)
    parseChapters(text, separatorPattern)
  }

  const handlePatternChange = (pattern: string) => {
    setSeparatorPattern(pattern)
    if (rawContent) {
      parseChapters(rawContent, pattern)
    }
  }

  const handleChapterEdit = (index: number, field: "title" | "content", value: string) => {
    setChapters((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch))
    )
  }

  const handleConfirmImport = () => {
    if (chapters.length === 0) {
      toast.error("Nenhum capítulo para importar")
      return
    }
    onImportComplete(chapters)
    toast.success(`${chapters.length} capítulo(s) importado(s)!`)
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging ? "border-gold bg-gold/5" : "border-border/50 hover:border-border"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileSelect}
        />

        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Processando...</span>
          </div>
        ) : (
          <>
            <FileText className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">
              Arraste um arquivo ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground">
              TXT suportado diretamente, PDF/DOCX: cole o conteúdo abaixo
            </p>
          </>
        )}
      </div>

      {/* Manual Text Input */}
      <div className="space-y-2">
        <Label>Ou cole o conteúdo diretamente:</Label>
        <Textarea
          value={rawContent}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Cole o texto da história aqui..."
          className="min-h-[150px] bg-secondary/50"
        />
      </div>

      {/* Separator Pattern */}
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <Label>Padrão de separação de capítulos:</Label>
          <Input
            value={separatorPattern}
            onChange={(e) => handlePatternChange(e.target.value)}
            placeholder="Ex: Capítulo, Chapter, Parte"
            className="bg-secondary/50"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => parseChapters(rawContent, separatorPattern)}
          className="mt-6"
        >
          Reprocessar
        </Button>
      </div>

      {/* Preview */}
      {chapters.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              Capítulos Detectados ({chapters.length})
            </h4>
            <Button type="button" onClick={handleConfirmImport}>
              Importar Todos
            </Button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {chapters.map((chapter, index) => (
              <Collapsible
                key={index}
                open={expandedIndex === index}
                onOpenChange={(open) => setExpandedIndex(open ? index : null)}
              >
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 bg-secondary/30 cursor-pointer hover:bg-secondary/50">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          #{chapter.order}
                        </span>
                        <span className="font-medium">{chapter.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{chapter.content.length} caracteres</span>
                        {expandedIndex === index ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-3 space-y-3 border-t border-border/50">
                      <div className="space-y-2">
                        <Label>Título</Label>
                        <Input
                          value={chapter.title}
                          onChange={(e) => handleChapterEdit(index, "title", e.target.value)}
                          className="bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Conteúdo (prévia)</Label>
                        <Textarea
                          value={chapter.content}
                          onChange={(e) => handleChapterEdit(index, "content", e.target.value)}
                          className="bg-secondary/50 min-h-[100px]"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-3 rounded-lg bg-card/30 border border-border/50 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Como funciona:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Cole o texto da sua história no campo acima</li>
            <li>O sistema detecta capítulos pelo padrão de separação</li>
            <li>Revise e edite cada capítulo antes de importar</li>
            <li>Clique em "Importar Todos" para adicionar à história</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
