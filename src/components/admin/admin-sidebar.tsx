"use client";

import {
  BookOpen,
  ChevronRight,
  Crown,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Scroll,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/stories", label: "Histórias", icon: BookOpen },
  { href: "/admin/wiki", label: "Wiki", icon: Scroll },
  { href: "/admin/media", label: "Mídia", icon: ImageIcon },
];

interface AdminSidebarProps {
  className?: string;
  onClose?: () => void;
}

export function AdminSidebar({ className, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  return (
    <aside
      className={cn(
        "w-64 border-r border-crimson/10 bg-black/90 backdrop-blur-lg flex flex-col h-full",
        className
      )}
    >
      {/* Header / Logo */}
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <Crown className="w-8 h-8 text-crimson" />
          <span className="font-bold">
            <span className="text-crimson">IMPERIAL</span>
            <span className="text-gold ml-1">CODEX</span>
          </span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <Separator className="bg-crimson/10" />

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-crimson/20 text-crimson"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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
      <div className="p-4 mt-auto">
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
              {user?.email}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => {
            signOut();
            onClose?.();
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
