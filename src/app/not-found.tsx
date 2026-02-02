"use client";

import { motion } from "framer-motion";
import { BookOpen, Crown, Home, Scroll } from "lucide-react";
import Link from "next/link";
import { Footer, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-imperial-gradient">
      <Header />

      <main className="flex flex-col items-center justify-center min-h-[80vh] relative overflow-hidden px-4 py-12">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated grid */}
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

          {/* Glowing orbs - smaller on mobile */}
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-crimson/5 rounded-full blur-[100px] md:blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gold/5 rounded-full blur-[100px] md:blur-[150px] animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Crown icon - responsive size */}
            <div className="relative inline-block mb-4 sm:mb-6 md:mb-8">
              <Crown className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-crimson/50 mx-auto" />
              <div className="absolute inset-0 blur-xl md:blur-2xl bg-crimson/20" />

              {/* Decorative broken effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-background rounded-full" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* 404 Number - responsive typography */}
            <h1 className="text-7xl sm:text-8xl md:text-[120px] lg:text-[150px] font-bold leading-none tracking-tighter mb-2">
              <span className="text-glow-crimson text-crimson">4</span>
              <span className="text-glow-gold text-gold">0</span>
              <span className="text-glow-crimson text-crimson">4</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-foreground">
              Página Perdida nas Sombras
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto mb-6 sm:mb-8 px-2">
              O caminho que você procura parece ter sido consumido pela
              escuridão. Esta página não existe ou foi movida para outro lugar
              no reino.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0"
          >
            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-crimson-gradient hover:opacity-90 text-white glow-crimson w-full sm:w-auto px-6"
              >
                <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Voltar ao Início
              </Button>
            </Link>
            <Link href="/stories" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 hover:border-gold w-full sm:w-auto px-6"
              >
                <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Explorar Histórias
              </Button>
            </Link>
          </motion.div>

          {/* Quick navigation links - responsive */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 sm:mt-12 md:mt-16"
          >
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Ou navegue diretamente para:
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2">
              <Link
                href="/wiki"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs sm:text-sm"
              >
                <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
                <span>Wiki</span>
              </Link>
              <Link
                href="/stories"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs sm:text-sm"
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-crimson" />
                <span>Histórias</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-xs sm:text-sm"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                <span>Início</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
