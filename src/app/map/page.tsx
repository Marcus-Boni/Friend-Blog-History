"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import dynamic from "next/dynamic"
import { 
  Crown, 
  ArrowLeft, 
  Info, 
  Compass, 
  Globe2,
  Scroll,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Dynamic import for Leaflet (SSR issues)
const ImperialMap = dynamic(
  () => import("@/components/map/imperial-map").then((mod) => mod.ImperialMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Carregando o mapa imperial...</p>
        </div>
      </div>
    )
  }
)

export default function MapPage() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(220, 20, 60, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 20, 60, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            
            <div className="h-6 w-px bg-border" />
            
            <Link href="/" className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-crimson" />
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-glow-crimson text-crimson">IMPERIAL CODEX</h1>
                <p className="text-xs text-muted-foreground">Mapa Interativo</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Link href="/wiki">
              <Button variant="ghost" size="sm" className="text-gold hover:bg-gold/10">
                <Scroll className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Wiki</span>
              </Button>
            </Link>
            <Link href="/stories">
              <Button variant="ghost" size="sm" className="text-crimson hover:bg-crimson/10">
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Histórias</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Introduction Modal */}
      {showIntro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative max-w-lg mx-4"
          >
            {/* Decorative corners */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gold" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-gold" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-gold" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gold" />

            <div className="bg-card/95 backdrop-blur-md border border-gold/30 rounded-lg p-8 text-center">
              <Globe2 className="h-16 w-16 text-gold mx-auto mb-4" />
              
              <Badge variant="outline" className="mb-4 border-crimson/50 text-crimson">
                MAPA DO IMPÉRIO
              </Badge>
              
              <h2 className="text-2xl font-bold mb-4">
                Bem-vindo ao <span className="text-gold text-glow-gold">Mapa Imperial</span>
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Explore o vasto território do universo Imperial Codex. 
                Descubra locais históricos, personagens lendários e eventos 
                que moldaram este mundo fantástico.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <Compass className="h-6 w-6 text-crimson mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Navegue livremente</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <Info className="h-6 w-6 text-gold mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Clique nos marcadores</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <Scroll className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Acesse o Codex</p>
                </div>
              </div>

              <Button 
                onClick={() => setShowIntro(false)}
                className="bg-gold-gradient text-black hover:opacity-90 glow-gold px-8"
              >
                Explorar Mapa
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Map Container */}
      <main className="fixed inset-0 pt-16">
        <ImperialMap className="w-full h-full" />
      </main>

      {/* Empty State CTA (shown when no markers) */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground mb-2 opacity-60">
            Adicione localizações às suas entidades Wiki para vê-las no mapa
          </p>
        </motion.div>
      </div>
    </div>
  )
}
