"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { MapPin, Target, Layers, Save, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUpdateEntityPosition } from "@/hooks/use-map"
import { cn } from "@/lib/utils"

interface MapCoordinateEditorProps {
  entityId: string
  entityName: string
  currentX?: number | null
  currentY?: number | null
  currentLayer?: string | null
  onSuccess?: () => void
}

export function MapCoordinateEditor({
  entityId,
  entityName,
  currentX,
  currentY,
  currentLayer,
  onSuccess,
}: MapCoordinateEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [xCoord, setXCoord] = useState(currentX?.toString() ?? "")
  const [yCoord, setYCoord] = useState(currentY?.toString() ?? "")
  const [layer, setLayer] = useState(currentLayer ?? "")
  const [error, setError] = useState<string | null>(null)

  const { mutate: updatePosition, isPending } = useUpdateEntityPosition()

  const hasCoordinates = currentX !== null && currentY !== null

  const handleSave = useCallback(() => {
    setError(null)

    const x = parseFloat(xCoord)
    const y = parseFloat(yCoord)

    if (isNaN(x) || isNaN(y)) {
      setError("Por favor, insira coordenadas numéricas válidas.")
      return
    }

    // Validate range (for our CRS.Simple map)
    if (x < -256 || x > 256 || y < -256 || y > 256) {
      setError("As coordenadas devem estar entre -256 e 256.")
      return
    }

    updatePosition(
      { id: entityId, x, y, layer: layer || undefined },
      {
        onSuccess: () => {
          setIsOpen(false)
          onSuccess?.()
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : "Erro ao salvar coordenadas.")
        },
      }
    )
  }, [entityId, xCoord, yCoord, layer, updatePosition, onSuccess])

  const handleClear = useCallback(() => {
    setXCoord("")
    setYCoord("")
    setLayer("")
    setError(null)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2",
            hasCoordinates
              ? "border-gold/50 text-gold hover:bg-gold/10"
              : "border-muted-foreground/50 text-muted-foreground hover:border-gold/50 hover:text-gold"
          )}
        >
          <MapPin className="h-4 w-4" />
          {hasCoordinates ? "Editar Posição" : "Adicionar ao Mapa"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-crimson/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gold" />
            Coordenadas do Mapa
          </DialogTitle>
          <DialogDescription>
            Defina a posição de <span className="text-gold font-medium">{entityName}</span> no
            mapa interativo do Imperial Codex.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Coordinate Preview */}
          <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">X</p>
                <p className="text-lg font-mono text-crimson">
                  {xCoord || "—"}
                </p>
              </div>
              <div className="text-muted-foreground">•</div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Y</p>
                <p className="text-lg font-mono text-gold">
                  {yCoord || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="x-coord" className="text-muted-foreground">
                Coordenada X
              </Label>
              <Input
                id="x-coord"
                type="number"
                step="0.1"
                min="-256"
                max="256"
                placeholder="0.0"
                value={xCoord}
                onChange={(e) => setXCoord(e.target.value)}
                className="bg-secondary/50 border-border/50 focus:border-crimson"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="y-coord" className="text-muted-foreground">
                Coordenada Y
              </Label>
              <Input
                id="y-coord"
                type="number"
                step="0.1"
                min="-256"
                max="256"
                placeholder="0.0"
                value={yCoord}
                onChange={(e) => setYCoord(e.target.value)}
                className="bg-secondary/50 border-border/50 focus:border-gold"
              />
            </div>
          </div>

          {/* Layer Field */}
          <div className="space-y-2">
            <Label htmlFor="layer" className="text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Camada (opcional)
            </Label>
            <Input
              id="layer"
              placeholder="ex: território-norte, subterrâneo"
              value={layer}
              onChange={(e) => setLayer(e.target.value)}
              className="bg-secondary/50 border-border/50 focus:border-purple-500"
            />
            <p className="text-xs text-muted-foreground">
              Use camadas para organizar diferentes regiões ou dimensões do mapa.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Coordinate Range Info */}
          <p className="text-xs text-muted-foreground text-center">
            Intervalo válido: <span className="font-mono">-256</span> a{" "}
            <span className="font-mono">256</span> para ambos os eixos.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-border/50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending || !xCoord || !yCoord}
              className="bg-gold-gradient text-black hover:opacity-90"
            >
              {isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
