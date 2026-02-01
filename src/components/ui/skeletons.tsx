import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"

/**
 * PageHeaderSkeleton - For page title and description loading states
 */
interface PageHeaderSkeletonProps {
  className?: string
  showDescription?: boolean
}

export function PageHeaderSkeleton({ 
  className, 
  showDescription = true 
}: PageHeaderSkeletonProps) {
  return (
    <div className={cn("mb-8", className)}>
      <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mb-2" />
      {showDescription && (
        <Skeleton className="h-4 sm:h-5 w-full max-w-md" />
      )}
    </div>
  )
}

/**
 * CardSkeleton - Generic card loading state
 */
interface CardSkeletonProps {
  className?: string
  imageAspect?: "square" | "video" | "wide"
  showMeta?: boolean
}

export function CardSkeleton({ 
  className, 
  imageAspect = "video",
  showMeta = true 
}: CardSkeletonProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/10]",
  }

  return (
    <div className={cn("rounded-lg border border-border/50 overflow-hidden bg-card/50", className)}>
      <Skeleton className={cn(aspectClasses[imageAspect], "rounded-none")} />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        {showMeta && (
          <div className="flex gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * TableRowSkeleton - For table loading states
 */
interface TableRowSkeletonProps {
  columns: number
  className?: string
}

export function TableRowSkeleton({ columns, className }: TableRowSkeletonProps) {
  return (
    <tr className={cn("border-b border-border/50", className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full max-w-[200px]" />
        </td>
      ))}
    </tr>
  )
}

/**
 * FormSkeleton - For form loading states
 */
interface FormSkeletonProps {
  fields?: number
  className?: string
}

export function FormSkeleton({ fields = 4, className }: FormSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}

/**
 * ContentSkeleton - For article/content loading states
 */
interface ContentSkeletonProps {
  lines?: number
  className?: string
}

export function ContentSkeleton({ lines = 5, className }: ContentSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )} 
        />
      ))}
    </div>
  )
}

/**
 * GridSkeleton - For grid loading states
 */
interface GridSkeletonProps {
  count?: number
  columns?: 2 | 3 | 4
  imageAspect?: "square" | "video" | "wide"
  className?: string
}

export function GridSkeleton({ 
  count = 6, 
  columns = 3,
  imageAspect = "video",
  className
}: GridSkeletonProps) {
  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  return (
    <div className={cn("grid gap-4 md:gap-6", colClasses[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} imageAspect={imageAspect} />
      ))}
    </div>
  )
}
