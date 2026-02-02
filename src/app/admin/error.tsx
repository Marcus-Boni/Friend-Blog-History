"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bug,
  Check,
  Copy,
  Home,
  LayoutDashboard,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Admin panel error:", error);
  }, [error]);

  const copyErrorDetails = async () => {
    const errorDetails = `
Error: ${error.message}
Stack: ${error.stack || "N/A"}
Digest: ${error.digest || "N/A"}
Time: ${new Date().toISOString()}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-imperial-gradient flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 23, 68, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 23, 68, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 bg-destructive/10 rounded-full blur-[100px] md:blur-[150px] animate-pulse" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center w-full max-w-md px-2 sm:px-4"
      >
        {/* Error icon - responsive */}
        <div className="relative inline-block mb-4 sm:mb-6">
          <div className="p-4 sm:p-5 rounded-full bg-destructive/10 border border-destructive/30">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-destructive" />
          </div>
          <div className="absolute inset-0 blur-xl md:blur-2xl bg-destructive/15 animate-pulse" />
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-destructive">
          Erro no Painel Admin
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
          Ocorreu um erro ao processar sua solicitação. Isso pode ser um
          problema temporário ou um bug que precisamos corrigir.
        </p>

        {/* Error details card - responsive */}
        <div className="bg-card/50 border border-border/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-destructive text-xs sm:text-sm font-medium">
              <Bug className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Detalhes do Erro</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyErrorDetails}
              className="text-muted-foreground hover:text-foreground h-7 sm:h-8 px-2"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </Button>
          </div>
          <div className="bg-secondary/50 rounded p-2 sm:p-3 overflow-auto max-h-24 sm:max-h-32">
            <code className="text-[10px] sm:text-xs text-muted-foreground break-all">
              {error.message}
            </code>
          </div>
          {error.digest && (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
              Digest: <code className="text-crimson/70">{error.digest}</code>
            </p>
          )}
        </div>

        {/* Action buttons - responsive */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
          <Button
            size="lg"
            onClick={reset}
            className="bg-crimson-gradient hover:opacity-90 text-white w-full sm:w-auto"
          >
            <RefreshCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Tentar Novamente
          </Button>
          <Link href="/admin" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-secondary w-full"
            >
              <LayoutDashboard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Ir para Dashboard
            </Button>
          </Link>
        </div>

        {/* Additional options */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Voltar ao site principal
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
