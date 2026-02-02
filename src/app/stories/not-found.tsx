"use client";

import { motion } from "framer-motion";
import { BookOpen, Flame, Home, Scroll, Sparkles } from "lucide-react";
import Link from "next/link";
import { Footer, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function StoriesNotFound() {
  return (
    <div className="min-h-screen bg-imperial-gradient">
      <Header />

      <main className="flex flex-col items-center justify-center min-h-[80vh] relative overflow-hidden px-4 py-12">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(220, 20, 60, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(220, 20, 60, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
          <div className="absolute top-1/4 left-1/3 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-crimson/5 rounded-full blur-[100px] md:blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 bg-purple-500/5 rounded-full blur-[100px] md:blur-[150px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Book icon - responsive */}
            <div className="relative inline-block mb-4 sm:mb-6 md:mb-8">
              <div className="p-4 sm:p-5 md:p-6 rounded-full bg-crimson/10 border border-crimson/30">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-crimson/70" />
              </div>
              <div className="absolute inset-0 blur-xl md:blur-2xl bg-crimson/15" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-2 sm:mb-4">
              <span className="text-crimson/70">4</span>
              <span className="text-gold/70">0</span>
              <span className="text-crimson/70">4</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-foreground">
              História Não Encontrada
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto mb-6 sm:mb-8 px-2">
              Parece que esta história ainda não foi escrita ou foi perdida nas
              páginas do tempo. Que tal explorar outras narrativas?
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0"
          >
            <Link href="/stories" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-crimson-gradient hover:opacity-90 text-white glow-crimson w-full sm:w-auto px-6"
              >
                <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Ver Todas as Histórias
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 hover:border-gold w-full sm:w-auto px-6"
              >
                <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Voltar ao Início
              </Button>
            </Link>
          </motion.div>

          {/* Category suggestions - responsive */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-10 sm:mt-12 md:mt-16"
          >
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Explore por categoria:
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2">
              <Link
                href="/stories?category=dream"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs sm:text-sm"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                <span>Sonhos</span>
              </Link>
              <Link
                href="/stories?category=tale"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs sm:text-sm"
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-crimson" />
                <span>Contos</span>
              </Link>
              <Link
                href="/stories?category=chronicle"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs sm:text-sm"
              >
                <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                <span>Crônicas</span>
              </Link>
              <Link
                href="/stories?category=idea"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs sm:text-sm"
              >
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                <span>Ideias</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
