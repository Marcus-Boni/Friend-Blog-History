"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, Flame, Scroll, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Footer, Header } from "@/components/layout";
import { StoryGrid } from "@/components/stories";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStories } from "@/hooks";
import type { StoryCategory } from "@/types/database.types";

const categories: {
  value: StoryCategory | "all";
  label: string;
  icon: typeof BookOpen;
}[] = [
  { value: "all", label: "Todas", icon: BookOpen },
  { value: "dream", label: "Sonhos", icon: Sparkles },
  { value: "tale", label: "Contos", icon: BookOpen },
  { value: "chronicle", label: "Crônicas", icon: Scroll },
  { value: "idea", label: "Ideias", icon: Flame },
  { value: "thought", label: "Pensamentos", icon: Brain },
];

function StoriesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as StoryCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<
    StoryCategory | "all"
  >(initialCategory || "all");

  const { data, isLoading } = useStories({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    status: "published", // Apenas histórias publicadas para usuários comuns
    limit: 50,
  });

  return (
    <>
      {/* Filters Section */}
      <section className="pb-8 sticky top-16 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Tabs */}
            <Tabs
              value={selectedCategory}
              onValueChange={(v) =>
                setSelectedCategory(v as StoryCategory | "all")
              }
              className="w-full md:w-auto"
            >
              <TabsList className="bg-secondary/50 h-auto flex-wrap">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <TabsTrigger
                      key={cat.value}
                      value={cat.value}
                      className="data-[state=active]:bg-crimson data-[state=active]:text-white gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{cat.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {/* Result count */}
            <div className="text-sm text-muted-foreground">
              {data?.stories?.length ?? 0} histórias encontradas
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <StoryGrid
            stories={data?.stories}
            isLoading={isLoading}
            emptyMessage="Nenhuma história encontrada nesta categoria."
          />
        </div>
      </section>
    </>
  );
}

function StoriesLoading() {
  return (
    <>
      <section className="pb-8 sticky top-16 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-imperial-gradient">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-crimson/5 to-transparent" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge
              variant="outline"
              className="mb-4 border-crimson/50 text-crimson"
            >
              BIBLIOTECA
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-crimson">Histórias</span> do Codex
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore o acervo completo de narrativas, sonhos e ideias que
              compõem o universo Imperial. Cada história é uma porta para um
              novo mundo.
            </p>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={<StoriesLoading />}>
        <StoriesContent />
      </Suspense>

      <Footer />
    </div>
  );
}
