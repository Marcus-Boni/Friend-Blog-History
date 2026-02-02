"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Scroll,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-imperial-gradient flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(220, 20, 60, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(220, 20, 60, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 bg-crimson/5 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-52 md:w-64 h-40 sm:h-52 md:h-64 bg-gold/5 rounded-full blur-[80px] md:blur-[120px]" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center w-full max-w-md px-4"
      >
        {/* Shield icon - responsive */}
        <div className="relative inline-block mb-4 sm:mb-6 md:mb-8">
          <div className="p-4 sm:p-5 rounded-full bg-crimson/10 border border-crimson/30">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-crimson/70" />
          </div>
          <div className="absolute inset-0 blur-xl md:blur-2xl bg-crimson/10" />
        </div>

        {/* 404 Number - responsive */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 sm:mb-4">
          <span className="text-crimson/80">4</span>
          <span className="text-gold/80">0</span>
          <span className="text-crimson/80">4</span>
        </h1>

        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-foreground">
          Página Admin não encontrada
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2">
          A página que você está procurando não existe no painel administrativo
          ou você não tem permissão para acessá-la.
        </p>

        {/* Action buttons - responsive */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 sm:mb-10">
          <Link href="/admin" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="bg-crimson-gradient hover:opacity-90 text-white w-full"
            >
              <LayoutDashboard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Ir para Dashboard
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="border-gold/50 text-gold hover:bg-gold/10 w-full"
            >
              <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Voltar ao Site
            </Button>
          </Link>
        </div>

        {/* Quick navigation - responsive grid */}
        <div className="border-t border-border/50 pt-6 sm:pt-8">
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Navegação rápida:
          </p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 justify-center">
            <Link href="/admin" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground w-full text-xs sm:text-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/stories" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground w-full text-xs sm:text-sm"
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Histórias
              </Button>
            </Link>
            <Link href="/admin/wiki" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground w-full text-xs sm:text-sm"
              >
                <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Wiki
              </Button>
            </Link>
            <Link href="/admin/media" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground w-full text-xs sm:text-sm"
              >
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Mídia
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
