"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Crown,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Scroll,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/stories", label: "Histórias", icon: BookOpen },
  { href: "/admin/wiki", label: "Wiki", icon: Scroll },
  { href: "/admin/media", label: "Mídia", icon: ImageIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isLoading, isAdmin, signOut } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Só redireciona uma vez e apenas quando não está carregando
    if (!isLoading && !user && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.replace("/login");
    }
    // Reset o ref quando o usuário deslogar e depois logar novamente
    if (user) {
      hasRedirectedRef.current = false;
    }
  }, [isLoading, user, router]);

  if (!user) {
    // Mostra loading enquanto redireciona
    return (
      <div className="min-h-screen bg-imperial-gradient flex items-center justify-center">
        <LoadingSpinner variant="admin" size="md" text="Redirecionando..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-imperial-gradient flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-crimson/10 bg-black/50 backdrop-blur-lg flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-crimson" />
            <span className="font-bold">
              <span className="text-crimson">IMPERIAL</span>
              <span className="text-gold ml-1">CODEX</span>
            </span>
          </Link>
        </div>

        <Separator className="bg-crimson/10" />

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-crimson/20 text-crimson"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Separator className="bg-crimson/10" />

        {/* User section */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10 border border-crimson/30">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-crimson/20 text-crimson">
                {profile?.username?.[0]?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.username || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
