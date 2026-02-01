"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "./button"
import { Progress } from "./progress"
import { cn } from "@/lib/utils"
import { uploadFile, saveMediaRecord } from "@/lib/queries/media"
import { toast } from "sonner"

interface FileUploadDialogProps {
  onUploadComplete: (url: string, file?: File) => void
  folder?: "covers" | "wiki" | "content"
  accept?: string
  maxSize?: number // in MB
  allowedTypes?: string[]
}

interface UploadedFile {
  file: File
  progress: number
  status: "uploading" | "success" | "error"
  url?: string
  error?: string
}

export function FileUploadDialog({
  onUploadComplete,
  folder = "content",
  accept = "image/*,.pdf,.doc,.docx",
  maxSize = 10,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
}: FileUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `Arquivo muito grande. Máximo: ${maxSize}MB`
    }
    
    if (!allowedTypes.some(type => {
      if (type.includes("*")) {
        const prefix = type.split("/")[0]
        return file.type.startsWith(prefix)
      }
      return file.type === type
    })) {
      return "Tipo de arquivo não permitido"
    }
    
    return null
  }, [maxSize, allowedTypes])

  const uploadSingleFile = async (uploadFile: UploadedFile, index: number) => {
    try {
      // Simulate progress
      for (let i = 0; i <= 70; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setFiles(prev => prev.map((f, idx) => 
          idx === index ? { ...f, progress: i } : f
        ))
      }

      const { uploadFile: uploadFileToStorage } = await import("@/lib/queries/media")
      const result = await uploadFileToStorage(uploadFile.file, folder)
      
      // Update to 90%
      setFiles(prev => prev.map((f, idx) => 
        idx === index ? { ...f, progress: 90 } : f
      ))

      // Save media record
      await saveMediaRecord({
        filename: uploadFile.file.name,
        storage_path: result.path,
        url: result.publicUrl,
        mime_type: uploadFile.file.type,
        size_bytes: uploadFile.file.size,
      })

      // Complete
      setFiles(prev => prev.map((f, idx) => 
        idx === index ? { ...f, progress: 100, status: "success", url: result.publicUrl } : f
      ))

      return result.publicUrl
    } catch (error) {
      console.error("Upload error:", error)
      setFiles(prev => prev.map((f, idx) => 
        idx === index ? { 
          ...f, 
          status: "error", 
          error: error instanceof Error ? error.message : "Erro desconhecido" 
        } : f
      ))
      return null
    }
  }

  const handleFiles = useCallback(async (selectedFiles: FileList | File[]) => {
    const newFiles: UploadedFile[] = []
    
    for (const file of selectedFiles) {
      const error = validateFile(file)
      if (error) {
        toast.error(`${file.name}: ${error}`)
        continue
      }
      
      newFiles.push({
        file,
        progress: 0,
        status: "uploading",
      })
    }

    if (newFiles.length === 0) return

    setFiles(prev => [...prev, ...newFiles])

    // Upload files sequentially
    const startIndex = files.length
    for (let i = 0; i < newFiles.length; i++) {
      const url = await uploadSingleFile(newFiles[i], startIndex + i)
      if (url && i === 0) {
        // Call onUploadComplete with the first successful upload
        onUploadComplete(url, newFiles[i].file)
      }
    }
  }, [validateFile, files.length, folder, onUploadComplete])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return "🖼️"
    }
    if (mimeType === "application/pdf") {
      return "📄"
    }
    if (mimeType.includes("word") || mimeType.includes("document")) {
      return "📝"
    }
    return "📁"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging
            ? "border-gold bg-gold/5"
            : "border-border/50 hover:border-border hover:bg-secondary/30",
          "cursor-pointer"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <Upload className={cn(
          "w-12 h-12 mx-auto mb-4 transition-colors",
          isDragging ? "text-gold" : "text-muted-foreground"
        )} />
        
        <p className="text-lg font-medium mb-1">
          {isDragging ? "Solte aqui" : "Arraste arquivos ou clique para selecionar"}
        </p>
        <p className="text-sm text-muted-foreground">
          Imagens (JPG, PNG, GIF, WebP), PDF, DOC, DOCX até {maxSize}MB
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Arquivos</h4>
          {files.map((uploadedFile, index) => (
            <div
              key={`${uploadedFile.file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
            >
              <span className="text-2xl">
                {getFileIcon(uploadedFile.file.type)}
              </span>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(uploadedFile.file.size)}
                </p>
                
                {uploadedFile.status === "uploading" && (
                  <Progress value={uploadedFile.progress} className="h-1 mt-2" />
                )}
                
                {uploadedFile.status === "error" && (
                  <p className="text-xs text-destructive mt-1">
                    {uploadedFile.error}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {uploadedFile.status === "uploading" && (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                )}
                {uploadedFile.status === "success" && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {uploadedFile.status === "error" && (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Actions */}
      {files.some(f => f.status === "success") && (
        <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => {
              const successfulFile = files.find(f => f.status === "success")
              if (successfulFile?.url) {
                navigator.clipboard.writeText(successfulFile.url)
                toast.success("URL copiada!")
              }
            }}
          >
            Copiar URL
          </Button>
          <Button
            onClick={() => {
              const successfulFile = files.find(f => f.status === "success")
              if (successfulFile?.url) {
                onUploadComplete(successfulFile.url, successfulFile.file)
              }
            }}
          >
            Usar Arquivo
          </Button>
        </div>
      )}
    </div>
  )
}
