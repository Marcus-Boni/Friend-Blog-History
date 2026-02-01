"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Globe2, MapPin, Users, Scroll, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMapMarkers } from "@/hooks/use-map"

export function MapPreview() {
  const { data: markers = [], isLoading } = useMapMarkers()

  // Count by type
  const locationCount = markers.filter((m) => m.entityType === "location").length
  const characterCount = markers.filter((m) => m.entityType === "character").length
  const otherCount = markers.length - locationCount - characterCount

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Background Map Preview */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/map-tile-texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent" />
      
      {/* Decorative Grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(220, 20, 60, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 20, 60, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative Compass */}
      <div className="absolute top-8 right-8 opacity-20">
        <Globe2 className="w-32 h-32 text-gold" />
      </div>

      {/* Content */}
      <div className="relative p-8 md:p-12">
        <Badge variant="outline" className="mb-4 border-gold/50 text-gold">
          MAPA INTERATIVO
        </Badge>

        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          Explore o <span className="text-gold text-glow-gold">Império</span>
        </h3>

        <p className="text-muted-foreground max-w-lg mb-8 leading-relaxed">
          Navegue pelo mapa interativo e descubra locais históricos, 
          personagens lendários e eventos que moldaram o universo do 
          Imperial Codex.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mb-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Carregando...</span>
            </div>
          ) : markers.length > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gold/10">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gold">{locationCount}</p>
                  <p className="text-xs text-muted-foreground">Locais</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-crimson/10">
                  <Users className="h-5 w-5 text-crimson" />
                </div>
                <div>
                  <p className="text-lg font-bold text-crimson">{characterCount}</p>
                  <p className="text-xs text-muted-foreground">Personagens</p>
                </div>
              </div>
              {otherCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Scroll className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-400">{otherCount}</p>
                    <p className="text-xs text-muted-foreground">Outros</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Adicione coordenadas às suas entidades para vê-las no mapa
            </p>
          )}
        </div>

        {/* CTA */}
        <Link href="/map">
          <Button 
            size="lg"
            className="bg-gold-gradient text-black hover:opacity-90 glow-gold group"
          >
            <Globe2 className="h-5 w-5 mr-2" />
            Explorar Mapa
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Animated Map Pins */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={{ y: [-5, 0, -5] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            className="w-3 h-4 rounded-full"
            style={{
              background: i === 0 ? "#dc143c" : i === 1 ? "#ffd700" : "#8b5cf6",
              boxShadow: `0 0 10px ${i === 0 ? "#dc143c" : i === 1 ? "#ffd700" : "#8b5cf6"}`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
