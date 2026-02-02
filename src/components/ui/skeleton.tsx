import { cn } from "@/lib/utils";

interface SkeletonProps extends React.ComponentProps<"div"> {
  /**
   * Variant of the skeleton
   * - default: Subtle dark gray, best for most use cases
   * - shimmer: Adds a shimmer effect for premium feel
   */
  variant?: "default" | "shimmer";
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md",
        variant === "default" && "bg-secondary/80 animate-pulse",
        variant === "shimmer" &&
          "bg-secondary/60 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
