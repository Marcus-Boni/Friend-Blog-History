"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  MapPin, 
  Scroll, 
  Calendar, 
  Package, 
  Lightbulb, 
  Building2,
  X,
  ExternalLink,
  BookOpen,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Filter
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  useMapMarkers, 
  useMapEntityDetails, 
  useMapLayers,
  DEFAULT_MAP_VIEW,
  MIN_ZOOM,
  MAX_ZOOM
} from "@/hooks/use-map"
import type { MapMarker } from "@/lib/queries/map"
import type { WikiEntityType } from "@/types/database.types"

// Entity type configurations
const entityTypeConfig: Record<
  WikiEntityType,
  { icon: typeof Users; color: string; bgColor: string; label: string }
> = {
  character: {
    icon: Users,
    color: "#dc143c",
    bgColor: "rgba(220, 20, 60, 0.2)",
    label: "Personagem",
  },
  location: {
    icon: MapPin,
    color: "#ffd700",
    bgColor: "rgba(255, 215, 0, 0.2)",
    label: "Local",
  },
  fact: {
    icon: Scroll,
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.2)",
    label: "Fato",
  },
  event: {
    icon: Calendar,
    color: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.2)",
    label: "Evento",
  },
  item: {
    icon: Package,
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.2)",
    label: "Item",
  },
  concept: {
    icon: Lightbulb,
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.2)",
    label: "Conceito",
  },
  organization: {
    icon: Building2,
    color: "#ec4899",
    bgColor: "rgba(236, 72, 153, 0.2)",
    label: "Organização",
  },
}

// Custom marker creation
function createCustomMarkerIcon(entityType: WikiEntityType): L.DivIcon {
  const config = entityTypeConfig[entityType]
  
  return L.divIcon({
    className: "custom-map-marker",
    html: `
      <div class="marker-container" style="
        --marker-color: ${config.color};
        --marker-bg: ${config.bgColor};
      ">
        <div class="marker-pin">
          <div class="marker-icon-bg"></div>
          <div class="marker-glow"></div>
        </div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  })
}

interface ImperialMapProps {
  className?: string
  initialLayer?: string
  onMarkerClick?: (marker: MapMarker) => void
}

export function ImperialMap({ className, initialLayer, onMarkerClick }: ImperialMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null)
  const [activeLayer, setActiveLayer] = useState<string | undefined>(initialLayer)
  const [activeFilters, setActiveFilters] = useState<WikiEntityType[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLayerOpen, setIsLayerOpen] = useState(false)
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_MAP_VIEW.zoom)

  // Fetch data
  const { data: markers = [], isLoading: markersLoading } = useMapMarkers({
    layer: activeLayer,
    entityTypes: activeFilters.length > 0 ? activeFilters : undefined,
  })
  const { data: entityDetails, isLoading: detailsLoading } = useMapEntityDetails(selectedMarkerId)
  const { data: layers = [] } = useMapLayers()

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_MAP_VIEW.center,
      zoom: DEFAULT_MAP_VIEW.zoom,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoomControl: false,
      attributionControl: false,
      // CRS for custom image layer (no geographic projection)
      crs: L.CRS.Simple,
    })

    // Add custom tile layer with our texture
    const imageBounds: L.LatLngBoundsExpression = [[-256, -256], [256, 256]]
    
    // Use a repeating pattern for the background
    L.tileLayer('/map-tile-texture.png', {
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      tileSize: 512,
      noWrap: false,
    }).addTo(map)

    // Add vignette overlay
    const vignettePane = map.createPane('vignette')
    vignettePane.style.zIndex = '400'
    vignettePane.style.pointerEvents = 'none'

    // Track zoom changes
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom())
    })

    // Create marker layer group
    markersRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = null
    }
  }, [])

  // Update markers when data changes
  useEffect(() => {
    if (!markersRef.current || !mapRef.current) return

    // Clear existing markers
    markersRef.current.clearLayers()

    // Add new markers
    markers.forEach((marker) => {
      const icon = createCustomMarkerIcon(marker.entityType)
      const leafletMarker = L.marker([marker.y, marker.x], { icon })
        .on('click', () => {
          setSelectedMarkerId(marker.id)
          onMarkerClick?.(marker)
        })
      
      markersRef.current?.addLayer(leafletMarker)
    })
  }, [markers, onMarkerClick])

  // Map controls
  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn()
  }, [])

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut()
  }, [])

  const handleResetView = useCallback(() => {
    mapRef.current?.setView(DEFAULT_MAP_VIEW.center, DEFAULT_MAP_VIEW.zoom)
  }, [])

  const toggleFilter = useCallback((type: WikiEntityType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }, [])

  const closeDetails = useCallback(() => {
    setSelectedMarkerId(null)
  }, [])

  return (
    <div className={cn("relative w-full h-full overflow-hidden rounded-lg", className)}>
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 z-0"
        style={{ background: '#0a0a0a' }}
      />

      {/* Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.8) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.5) 100%)
          `
        }}
      />

      {/* Decorative Frame */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute inset-4 border border-crimson/20 rounded-lg" />
        <div className="absolute inset-6 border border-gold/10 rounded-lg" />
        
        {/* Corner ornaments */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-crimson/50 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-crimson/50 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-crimson/50 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-crimson/50 rounded-br-lg" />
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="glass rounded-lg p-1 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gold hover:bg-gold/10 hover:text-gold"
            onClick={handleZoomIn}
            disabled={currentZoom >= MAX_ZOOM}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gold hover:bg-gold/10 hover:text-gold"
            onClick={handleZoomOut}
            disabled={currentZoom <= MIN_ZOOM}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="h-px bg-gold/20 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gold hover:bg-gold/10 hover:text-gold"
            onClick={handleResetView}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Layer & Filter Controls */}
      <div className="absolute top-4 left-4 z-30 flex gap-2">
        {/* Layers Button */}
        {layers.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="glass text-gold hover:bg-gold/10"
              onClick={() => setIsLayerOpen(!isLayerOpen)}
            >
              <Layers className="h-4 w-4 mr-2" />
              Camadas
            </Button>
            
            <AnimatePresence>
              {isLayerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 glass rounded-lg p-2 min-w-[160px]"
                >
                  <button
                    onClick={() => { setActiveLayer(undefined); setIsLayerOpen(false) }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                      !activeLayer ? "bg-gold/20 text-gold" : "text-foreground hover:bg-white/5"
                    )}
                  >
                    Todas
                  </button>
                  {layers.map((layer) => (
                    <button
                      key={layer}
                      onClick={() => { setActiveLayer(layer); setIsLayerOpen(false) }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded text-sm transition-colors capitalize",
                        activeLayer === layer ? "bg-gold/20 text-gold" : "text-foreground hover:bg-white/5"
                      )}
                    >
                      {layer}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Filter Button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "glass hover:bg-crimson/10",
              activeFilters.length > 0 ? "text-crimson" : "text-gold"
            )}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFilters.length > 0 && (
              <Badge className="ml-2 bg-crimson text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFilters.length}
              </Badge>
            )}
          </Button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 glass rounded-lg p-3 min-w-[200px]"
              >
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                  Tipo de Entidade
                </p>
                <div className="space-y-1">
                  {(Object.entries(entityTypeConfig) as [WikiEntityType, typeof entityTypeConfig[WikiEntityType]][]).map(
                    ([type, config]) => {
                      const Icon = config.icon
                      const isActive = activeFilters.includes(type)
                      return (
                        <button
                          key={type}
                          onClick={() => toggleFilter(type)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors",
                            isActive
                              ? "bg-opacity-20 text-opacity-100"
                              : "text-foreground hover:bg-white/5"
                          )}
                          style={{
                            backgroundColor: isActive ? config.bgColor : undefined,
                            color: isActive ? config.color : undefined,
                          }}
                        >
                          <Icon className="h-4 w-4" />
                          {config.label}
                        </button>
                      )
                    }
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Loading Indicator */}
      {markersLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="glass rounded-lg p-4 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Carregando mapa...</span>
          </div>
        </div>
      )}

      {/* Marker Count Badge */}
      {!markersLoading && markers.length > 0 && (
        <div className="absolute bottom-4 left-4 z-30">
          <div className="glass rounded-lg px-3 py-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" />
            <span className="text-sm text-foreground">
              <span className="font-bold text-gold">{markers.length}</span> marcador{markers.length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Entity Details Panel */}
      <AnimatePresence>
        {selectedMarkerId && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-4 right-16 bottom-4 w-80 z-30"
          >
            <Card className="h-full bg-card/95 backdrop-blur-md border-crimson/30 overflow-hidden">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={closeDetails}
              >
                <X className="h-4 w-4" />
              </Button>

              {detailsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
                </div>
              ) : entityDetails ? (
                <ScrollArea className="h-full">
                  <CardContent className="p-0">
                    {/* Entity Image */}
                    {entityDetails.image_url && (
                      <div className="relative aspect-video">
                        <Image
                          src={entityDetails.image_url}
                          alt={entityDetails.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="p-4 space-y-4">
                      {/* Entity Type Badge */}
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor: entityTypeConfig[entityDetails.entity_type].bgColor,
                          color: entityTypeConfig[entityDetails.entity_type].color,
                        }}
                      >
                        {entityTypeConfig[entityDetails.entity_type].label}
                      </Badge>

                      {/* Entity Name */}
                      <h3 className="text-xl font-bold text-foreground">
                        {entityDetails.name}
                      </h3>

                      {/* Short Description */}
                      {entityDetails.short_description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {entityDetails.short_description}
                        </p>
                      )}

                      {/* Related Stories */}
                      {entityDetails.relatedStories.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gold flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Histórias Relacionadas
                          </h4>
                          <div className="space-y-1">
                            {entityDetails.relatedStories.slice(0, 3).map((story) => (
                              <Link
                                key={story.id}
                                href={`/stories/${story.slug}`}
                                className="block px-3 py-2 rounded bg-secondary/50 hover:bg-secondary transition-colors text-sm"
                              >
                                {story.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Entities */}
                      {entityDetails.relatedEntities.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-crimson flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Entidades Relacionadas
                          </h4>
                          <div className="space-y-1">
                            {entityDetails.relatedEntities.slice(0, 3).map((entity) => {
                              const Icon = entityTypeConfig[entity.entityType].icon
                              return (
                                <Link
                                  key={entity.id}
                                  href={`/wiki/${entity.slug}`}
                                  className="flex items-center gap-2 px-3 py-2 rounded bg-secondary/50 hover:bg-secondary transition-colors text-sm"
                                >
                                  <Icon 
                                    className="h-4 w-4" 
                                    style={{ color: entityTypeConfig[entity.entityType].color }}
                                  />
                                  <span>{entity.name}</span>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {entity.relationType}
                                  </span>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* View Full Entity Button */}
                      <Link href={`/wiki/${entityDetails.slug}`}>
                        <Button className="w-full bg-crimson-gradient hover:opacity-90 mt-4">
                          Ver no Codex
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </ScrollArea>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Entidade não encontrada
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="glass rounded-lg p-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            Legenda
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {(Object.entries(entityTypeConfig) as [WikiEntityType, typeof entityTypeConfig[WikiEntityType]][]).slice(0, 4).map(
              ([type, config]) => {
                const Icon = config.icon
                return (
                  <div key={type} className="flex items-center gap-1.5">
                    <Icon className="h-3 w-3" style={{ color: config.color }} />
                    <span className="text-xs text-muted-foreground">{config.label}</span>
                  </div>
                )
              }
            )}
          </div>
        </div>
      </div>

      {/* Custom Marker Styles */}
      <style jsx global>{`
        .custom-map-marker {
          background: transparent !important;
          border: none !important;
        }

        .marker-container {
          position: relative;
          width: 40px;
          height: 50px;
        }

        .marker-pin {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 40px;
          background: linear-gradient(
            180deg,
            var(--marker-color) 0%,
            color-mix(in srgb, var(--marker-color) 70%, black) 100%
          );
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          clip-path: polygon(50% 100%, 0% 35%, 0% 0%, 100% 0%, 100% 35%);
          box-shadow: 
            0 4px 20px var(--marker-bg),
            0 0 30px var(--marker-bg);
          transition: transform 0.2s ease;
        }

        .marker-pin:hover {
          transform: translateX(-50%) scale(1.1);
        }

        .marker-icon-bg {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 18px;
          height: 18px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 50%;
        }

        .marker-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 40px;
          background: radial-gradient(
            ellipse at center,
            var(--marker-color) 0%,
            transparent 70%
          );
          opacity: 0.4;
          animation: marker-pulse 2s ease-in-out infinite;
        }

        .marker-pulse {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: var(--marker-color);
          border-radius: 50%;
          opacity: 0.6;
          animation: pulse-ring 1.5s ease-out infinite;
        }

        @keyframes marker-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        @keyframes pulse-ring {
          0% {
            transform: translateX(-50%) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateX(-50%) scale(3);
            opacity: 0;
          }
        }

        /* Leaflet overrides for dark theme */
        .leaflet-container {
          background: #0a0a0a !important;
          font-family: inherit;
        }

        .leaflet-tile-pane {
          opacity: 0.6;
        }

        .leaflet-grab {
          cursor: grab;
        }

        .leaflet-dragging .leaflet-grab {
          cursor: grabbing;
        }
      `}</style>
    </div>
  )
}
