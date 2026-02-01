"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Crown,
  BookOpen,
  Scroll,
  Users,
  MapPin,
  Sparkles,
  ChevronRight,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header, Footer } from "@/components/layout"
import { getEntityCounts } from "@/lib/queries/wiki"

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Category data for display
const categories = [
  {
    icon: Sparkles,
    label: "Sonhos",
    description: "Visões noturnas transformadas em narrativas",
    color: "text-purple-400",
    href: "/stories?category=dream",
  },
  {
    icon: BookOpen,
    label: "Contos",
    description: "Histórias completas de mundos fantásticos",
    color: "text-crimson",
    href: "/stories?category=tale",
  },
  {
    icon: Scroll,
    label: "Crônicas",
    description: "Registros épicos de eventos grandiosos",
    color: "text-gold",
    href: "/stories?category=chronicle",
  },
  {
    icon: Flame,
    label: "Ideias",
    description: "Conceitos e pensamentos em gestação",
    color: "text-orange-400",
    href: "/stories?category=idea",
  },
]

export default function HomePage() {
  // State for wiki entity counts
  const [wikiCounts, setWikiCounts] = useState({
    character: 0,
    location: 0,
    fact: 0,
  })

  // Fetch wiki entity counts on mount
  useEffect(() => {
    async function fetchCounts() {
      try {
        const counts = await getEntityCounts()
        setWikiCounts({
          character: counts.character || 0,
          location: counts.location || 0,
          fact: counts.fact || 0,
        })
      } catch (error) {
        console.error("Failed to fetch entity counts:", error)
      }
    }
    fetchCounts()
  }, [])

  // Wiki types with dynamic counts
  const wikiTypes = [
    {
      icon: Users,
      label: "Personagens",
      description: "Heróis, vilões e figuras memoráveis",
      count: wikiCounts.character,
      href: "/wiki?type=character",
    },
    {
      icon: MapPin,
      label: "Locais",
      description: "Reinos, cidades e lugares místicos",
      count: wikiCounts.location,
      href: "/wiki?type=location",
    },
    {
      icon: Scroll,
      label: "Fatos",
      description: "Eventos históricos e acontecimentos",
      count: wikiCounts.fact,
      href: "/wiki?type=fact",
    },
  ]

  return (
    <div className="min-h-screen bg-imperial-gradient">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

          {/* Animated grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(220, 20, 60, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(220, 20, 60, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Floating particles effect */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crimson/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px] animate-pulse delay-1000" />
        </div>

        {/* Hero content */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          {/* Crown icon */}
          <motion.div variants={fadeIn} className="mb-8">
            <div className="relative inline-block">
              <Crown className="w-20 h-20 md:w-28 md:h-28 text-crimson mx-auto" />
              <div className="absolute inset-0 blur-2xl bg-crimson/30" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="text-glow-crimson text-crimson">IMPERIAL</span>
            <br />
            <span className="text-glow-gold text-gold">CODEX</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeIn}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            O universo criativo de{" "}
            <span className="text-gold font-semibold">Baltazar</span>. Um
            santuário digital para histórias épicas, personagens únicos e mundos
            que desafiam a imaginação.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          >
            <Link href="/stories">
              <Button
                size="lg"
                className="bg-crimson-gradient hover:opacity-90 text-white glow-crimson px-8"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explorar Histórias
              </Button>
            </Link>
            <Link href="/wiki">
              <Button
                size="lg"
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 hover:border-gold px-8"
              >
                <Scroll className="mr-2 h-5 w-5" />
                Acessar o Codex
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - positioned outside the content container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-crimson/50 rounded-full flex justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-crimson rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 border-crimson/50 text-crimson"
            >
              CATEGORIAS
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Explore por <span className="text-crimson">Tipo</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Mergulhe nas diferentes formas de expressão criativa presentes no
              universo do Imperial Codex.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={category.href}>
                    <Card className="group bg-card/50 border-border/50 hover:border-crimson/50 transition-all duration-300 cursor-pointer overflow-hidden">
                      <CardContent className="p-6">
                        <div className="mb-4 inline-flex">
                          <Icon
                            className={`w-10 h-10 ${category.color} transition-transform duration-300 group-hover:scale-110 origin-center`}
                          />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-crimson transition-colors">
                          {category.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                        <div className="mt-4 flex items-center text-sm text-crimson opacity-0 group-hover:opacity-100 transition-opacity">
                          Explorar
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Wiki Preview Section */}
      <section className="py-24 relative bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 border-gold/50 text-gold"
            >
              CODEX WIKI
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              A <span className="text-gold">Enciclopédia</span> do Universo
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Um repositório completo de conhecimento sobre personagens, locais,
              eventos e tudo que habita este universo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {wikiTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <motion.div
                  key={type.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Link href={type.href}>
                    <Card className="group relative bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-gold/50 transition-all duration-500 cursor-pointer h-full overflow-hidden">
                      {/* Decorative corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold/10 to-transparent" />

                      <CardContent className="p-8 relative">
                        <div className="flex items-center justify-between mb-6">
                          <div className="p-3 rounded-lg bg-gold/10 text-gold group-hover:bg-gold/20 transition-colors">
                            <Icon className="w-8 h-8" />
                          </div>
                          <span className="text-3xl font-bold text-gold/30 group-hover:text-gold/50 transition-colors">
                            {String(type.count).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-gold transition-colors">
                          {type.label}
                        </h3>
                        <p className="text-muted-foreground">
                          {type.description}
                        </p>
                        <div className="mt-6 flex items-center text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                          Ver todos
                          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/wiki">
              <Button
                variant="outline"
                size="lg"
                className="border-gold/50 text-gold hover:bg-gold/10 hover:border-gold"
              >
                Explorar Codex Completo
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About/Creator Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-crimson/5 rounded-full blur-[200px]" />

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="aspect-square max-w-md mx-auto relative">
                {/* Decorative frame */}
                <div className="absolute inset-0 border-2 border-crimson/30 rounded-lg transform rotate-3" />
                <div className="absolute inset-0 border-2 border-gold/20 rounded-lg transform -rotate-3" />

                {/* Content placeholder */}
                <div className="absolute inset-4 bg-gradient-to-br from-card to-secondary rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src="/Eu-e-Balt-Morro-Moreno.jpeg"
                    alt="Baltazar - O Criador"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    priority
                  />
                  
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Animated border */}
                  <div className="absolute inset-0 animated-border rounded-lg pointer-events-none" />
                </div>
              </div>
            </motion.div>

            {/* Right side - Text */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge
                variant="outline"
                className="mb-4 border-crimson/50 text-crimson"
              >
                O AUTOR
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Conheça{" "}
                <span className="text-gold text-glow-gold">Baltazar</span>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Um visionário criativo com uma mente capaz de tecer mundos 
                  extraordinários a partir do tecido dos sonhos e da imaginação 
                  mais selvagem.
                </p>
                <p>
                  Inspirado pela rica tapeçaria da história — desde os campos 
                  de batalha da Europa nas Grandes Guerras até a majestade do 
                  Brasil Imperial — Baltazar cria narrativas que transcendem 
                  o ordinário.
                </p>
                <p>
                  O Imperial Codex é seu santuário digital, onde cada história, 
                  personagem e ideia encontra seu lugar eterno.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-crimson">∞</div>
                  <div className="text-xs text-muted-foreground">
                    Histórias
                  </div>
                </div>
                <div className="px-4 py-2 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-gold">∞</div>
                  <div className="text-xs text-muted-foreground">
                    Personagens
                  </div>
                </div>
                <div className="px-4 py-2 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">∞</div>
                  <div className="text-xs text-muted-foreground">Mundos</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-crimson/20 via-transparent to-gold/20" />
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />

            {/* Content */}
            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para{" "}
                <span className="text-crimson">mergulhar</span>?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Comece sua jornada pelo universo do Imperial Codex. Descubra 
                histórias que vão transportá-lo para além da imaginação.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/stories">
                  <Button
                    size="lg"
                    className="bg-crimson-gradient hover:opacity-90 glow-crimson"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Começar a Ler
                  </Button>
                </Link>
                <Link href="/wiki">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gold/50 text-gold hover:bg-gold/10"
                  >
                    <Scroll className="mr-2 h-5 w-5" />
                    Explorar Wiki
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
