"use client"

import { useRef, useCallback, useEffect, useState } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escreva aqui...",
  className,
  minHeight = "300px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize content only once
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || ""
      setIsInitialized(true)
    }
  }, [value, isInitialized])

  // Update content when value changes externally (not from user input)
  useEffect(() => {
    if (editorRef.current && isInitialized) {
      const currentContent = editorRef.current.innerHTML
      // Only update if value is significantly different (not just from our own onChange)
      if (value !== currentContent && value !== "" && currentContent === "") {
        editorRef.current.innerHTML = value
      }
    }
  }, [value, isInitialized])

  const execCommand = useCallback((command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue)
    editorRef.current?.focus()
    // Trigger change after command
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault()
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;")
      handleInput()
    }

    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault()
          execCommand("bold")
          break
        case "i":
          e.preventDefault()
          execCommand("italic")
          break
        case "u":
          e.preventDefault()
          execCommand("underline")
          break
        case "z":
          e.preventDefault()
          if (e.shiftKey) {
            execCommand("redo")
          } else {
            execCommand("undo")
          }
          break
      }
    }
  }

  const handleLinkInsert = () => {
    if (linkUrl.trim()) {
      execCommand("createLink", linkUrl)
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
    handleInput()
  }, [handleInput])

  const ToolbarButton = ({
    icon: Icon,
    onClick,
    title,
    active = false,
  }: {
    icon: typeof Bold
    onClick: () => void
    title: string
    active?: boolean
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", active && "bg-secondary")}
      onClick={onClick}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )

  return (
    <div className={cn("border border-border/50 rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-secondary/30 border-b border-border/50">
        <ToolbarButton icon={Undo} onClick={() => execCommand("undo")} title="Desfazer (Ctrl+Z)" />
        <ToolbarButton icon={Redo} onClick={() => execCommand("redo")} title="Refazer (Ctrl+Shift+Z)" />
        
        <div className="w-px h-6 bg-border/50 mx-1" />
        
        <ToolbarButton icon={Bold} onClick={() => execCommand("bold")} title="Negrito (Ctrl+B)" />
        <ToolbarButton icon={Italic} onClick={() => execCommand("italic")} title="Itálico (Ctrl+I)" />
        <ToolbarButton icon={Underline} onClick={() => execCommand("underline")} title="Sublinhado (Ctrl+U)" />
        
        <div className="w-px h-6 bg-border/50 mx-1" />
        
        <ToolbarButton
          icon={Heading1}
          onClick={() => execCommand("formatBlock", "<h1>")}
          title="Título 1"
        />
        <ToolbarButton
          icon={Heading2}
          onClick={() => execCommand("formatBlock", "<h2>")}
          title="Título 2"
        />
        <ToolbarButton
          icon={Heading3}
          onClick={() => execCommand("formatBlock", "<h3>")}
          title="Título 3"
        />
        
        <div className="w-px h-6 bg-border/50 mx-1" />
        
        <ToolbarButton
          icon={List}
          onClick={() => execCommand("insertUnorderedList")}
          title="Lista com marcadores"
        />
        <ToolbarButton
          icon={ListOrdered}
          onClick={() => execCommand("insertOrderedList")}
          title="Lista numerada"
        />
        <ToolbarButton
          icon={Quote}
          onClick={() => execCommand("formatBlock", "<blockquote>")}
          title="Citação"
        />
        
        <div className="w-px h-6 bg-border/50 mx-1" />
        
        <ToolbarButton
          icon={AlignLeft}
          onClick={() => execCommand("justifyLeft")}
          title="Alinhar à esquerda"
        />
        <ToolbarButton
          icon={AlignCenter}
          onClick={() => execCommand("justifyCenter")}
          title="Centralizar"
        />
        <ToolbarButton
          icon={AlignRight}
          onClick={() => execCommand("justifyRight")}
          title="Alinhar à direita"
        />
        
        <div className="w-px h-6 bg-border/50 mx-1" />
        
        <div className="relative">
          <ToolbarButton
            icon={LinkIcon}
            onClick={() => setShowLinkInput(!showLinkInput)}
            title="Inserir link"
          />
          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-popover border border-border rounded-md shadow-lg z-10 flex gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="px-2 py-1 text-sm bg-secondary/50 border border-border/50 rounded"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleLinkInsert()
                  }
                }}
              />
              <Button size="sm" onClick={handleLinkInsert}>
                OK
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          "p-4 bg-secondary/20 focus:outline-none",
          "prose prose-invert prose-sm max-w-none",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3",
          "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-gold/50 [&_blockquote]:pl-4 [&_blockquote]:italic",
          "[&_ul]:list-disc [&_ul]:pl-6",
          "[&_ol]:list-decimal [&_ol]:pl-6",
          "[&_a]:text-gold [&_a]:underline",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
        )}
        style={{ minHeight }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        data-placeholder={placeholder}
      />
    </div>
  )
}
