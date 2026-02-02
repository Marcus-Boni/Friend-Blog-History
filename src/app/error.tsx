"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Bug, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Footer, Header } from "@/components/layout";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-imperial-gradient">
      <Header />

      <main className="flex flex-col items-center justify-center min-h-[80vh] relative overflow-hidden px-4 py-12">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated grid with error color */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 23, 68, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 23, 68, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Glowing orbs - responsive sizes */}
          <div className="absolute top-1/3 left-1/3 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-destructive/10 rounded-full blur-[100px] md:blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-36 sm:w-56 md:w-72 h-36 sm:h-56 md:h-72 bg-crimson/5 rounded-full blur-[80px] md:blur-[150px] animate-pulse delay-700" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Error icon - responsive */}
            <div className="relative inline-block mb-4 sm:mb-6 md:mb-8">
              <div className="p-4 sm:p-5 md:p-6 rounded-full bg-destructive/10 border border-destructive/30">
                <AlertTriangle className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-destructive mx-auto" />
              </div>
              <div className="absolute inset-0 blur-xl md:blur-2xl bg-destructive/20 animate-pulse" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              <span className="text-destructive">Algo deu errado</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-4 px-2">
              Uma perturbação inesperada abalou o reino. Nossos escribas estão
              trabalhando para restaurar a ordem.
            </p>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="max-w-md mx-auto mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="flex items-center gap-2 text-destructive text-xs sm:text-sm mb-2">
                  <Bug className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-semibold">
                    Detalhes do erro (dev only):
                  </span>
                </div>
                <code className="text-xs text-muted-foreground break-all block text-left">
                  {error.message}
                </code>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0"
          >
            <Button
              size="lg"
              onClick={reset}
              className="bg-crimson-gradient hover:opacity-90 text-white glow-crimson w-full sm:w-auto px-6"
            >
              <RefreshCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Tentar Novamente
            </Button>
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

          {/* Support info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 sm:mt-10 md:mt-12"
          >
            <p className="text-xs sm:text-sm text-muted-foreground">
              Se o problema persistir, entre em contato conosco
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
