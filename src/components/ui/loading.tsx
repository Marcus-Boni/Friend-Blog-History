"use client"

import { Crown, Loader2, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  /**
   * Size of the spinner
   */
  size?: "sm" | "md" | "lg"
  /**
   * Variant of the loading indicator
   * - default: Simple spinner with text
   * - branded: Crown icon with Centuriões Verbum branding
   * - admin: Shield icon for admin panel
   * - minimal: Just the spinner, no text
   */
  variant?: "default" | "branded" | "admin" | "minimal"
  /**
   * Custom loading text
   */
  text?: string
  /**
   * Additional CSS classes
   */
  className?: string
}

const sizeClasses = {
  sm: {
    icon: "w-6 h-6",
    spinner: "w-4 h-4",
    text: "text-xs",
    bar: "w-24 h-0.5",
  },
  md: {
    icon: "w-10 h-10 sm:w-12 sm:h-12",
    spinner: "w-4 h-4 sm:w-5 sm:h-5",
    text: "text-sm sm:text-base",
    bar: "w-32 sm:w-40 h-1",
  },
  lg: {
    icon: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    spinner: "w-5 h-5 sm:w-6 sm:h-6",
    text: "text-base sm:text-lg",
    bar: "w-40 sm:w-48 h-1",
  },
}

export function LoadingSpinner({
  size = "md",
  variant = "default",
  text,
  className,
}: LoadingSpinnerProps) {
  const sizes = sizeClasses[size]
  
  // Minimal variant - just spinner
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <Loader2 className={cn(sizes.spinner, "animate-spin text-crimson")} />
      </div>
    )
  }

  // Branded variant - Crown with bar
  if (variant === "branded") {
    return (
      <div className={cn("text-center", className)}>
        <div className="relative inline-block mb-4 sm:mb-6">
          <Crown className={cn(sizes.icon, "text-crimson animate-pulse")} />
          <div className="absolute inset-0 blur-xl sm:blur-2xl bg-crimson/20 animate-pulse" />
        </div>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <Loader2 className={cn(sizes.spinner, "animate-spin text-gold")} />
          <span className={cn(sizes.text, "text-muted-foreground animate-pulse")}>
            {text || "Carregando..."}
          </span>
        </div>
        
        <div className={cn(sizes.bar, "mt-6 sm:mt-8 bg-secondary rounded-full overflow-hidden mx-auto")}>
          <div 
            className="h-full bg-gradient-to-r from-crimson via-gold to-crimson rounded-full animate-loading-bar"
          />
        </div>
      </div>
    )
  }

  // Admin variant - Shield
  if (variant === "admin") {
    return (
      <div className={cn("text-center", className)}>
        <div className="relative inline-block mb-4 sm:mb-6">
          <Shield className={cn(sizes.icon, "text-crimson/60 animate-pulse")} />
          <div className="absolute inset-0 blur-lg sm:blur-xl bg-crimson/10 animate-pulse" />
        </div>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <Loader2 className={cn(sizes.spinner, "animate-spin text-gold")} />
          <span className={cn(sizes.text, "text-muted-foreground")}>
            {text || "Carregando painel..."}
          </span>
        </div>
        
        <div className={cn(sizes.bar, "mt-5 sm:mt-6 bg-secondary rounded-full overflow-hidden mx-auto")}>
          <div 
            className="h-full bg-gradient-to-r from-crimson to-gold rounded-full animate-loading-bar"
          />
        </div>
      </div>
    )
  }

  // Default variant - Simple spinner with text
  return (
    <div className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}>
      <Loader2 className={cn(sizes.spinner, "animate-spin text-crimson")} />
      <span className={cn(sizes.text, "text-muted-foreground")}>
        {text || "Carregando..."}
      </span>
    </div>
  )
}

/**
 * Full page loading component - centered in viewport
 */
interface PageLoadingProps {
  variant?: "branded" | "admin"
  text?: string
}

export function PageLoading({ variant = "branded", text }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-imperial-gradient flex items-center justify-center px-4">
      <LoadingSpinner variant={variant} size="lg" text={text} />
    </div>
  )
}

/**
 * Section loading component - for loading states within a section
 */
interface SectionLoadingProps {
  text?: string
  className?: string
}

export function SectionLoading({ text, className }: SectionLoadingProps) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <LoadingSpinner variant="default" size="md" text={text} />
    </div>
  )
}

/**
 * Inline loading component - for buttons and small elements
 */
interface InlineLoadingProps {
  text?: string
  className?: string
}

export function InlineLoading({ text, className }: InlineLoadingProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className="w-4 h-4 animate-spin" />
      {text && <span className="text-sm">{text}</span>}
    </div>
  )
}
