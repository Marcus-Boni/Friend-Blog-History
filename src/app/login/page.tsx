"use client";

import { motion } from "framer-motion";
import { Crown, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redireciona se já estiver logado
  useEffect(() => {
    if (!authLoading && user) {
      const redirect = searchParams.get("redirect") || "/admin";
      router.replace(redirect);
    }
  }, [user, authLoading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success("Login realizado com sucesso!");
      const redirect = searchParams.get("redirect") || "/admin";
      router.replace(redirect);
    } catch (error) {
      toast.error("Falha no login. Verifique suas credenciais.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostra loading se estiver verificando autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-imperial-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Crown className="w-16 h-16 text-crimson animate-pulse" />
          <p className="text-sm text-muted-foreground">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }

  // Se já está logado, mostra loading enquanto redireciona
  if (user) {
    return (
      <div className="min-h-screen bg-imperial-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Crown className="w-16 h-16 text-crimson animate-pulse" />
          <p className="text-sm text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-imperial-gradient flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crimson/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="relative">
              <Crown className="w-16 h-16 text-crimson" />
              <div className="absolute inset-0 blur-xl bg-crimson/30" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-crimson">CENTURIÕES</span>
              <span className="text-gold ml-1">VERBUM</span>
            </span>
          </Link>
        </div>

        <Card className="bg-card/80 backdrop-blur-lg border-crimson/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Acesso Administrativo</CardTitle>
            <CardDescription>
              Entre com suas credenciais para gerenciar o conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/50 border-border/50 focus:border-crimson/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-crimson/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-crimson-gradient hover:opacity-90 glow-crimson"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Voltar ao site
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-xs text-muted-foreground">
          Acesso restrito aos administradores do Centuriões Verbum
        </p>
      </motion.div>
    </div>
  );
}
