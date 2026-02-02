"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { useAuth } from "@/hooks";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const hasRedirectedRef = useRef(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-imperial-gradient flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-crimson/10 bg-black/50 backdrop-blur-lg sticky top-0 z-40">
        <span className="font-bold">
          <span className="text-crimson">IMPERIAL</span>
          <span className="text-gold ml-1">CODEX</span>
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs md:hidden"
            >
              <AdminSidebar onClose={() => setIsMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 md:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
