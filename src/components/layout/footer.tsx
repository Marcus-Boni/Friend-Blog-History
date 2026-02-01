import Link from "next/link"
import { Crown, Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-crimson/10 bg-black/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-crimson" />
              <span className="text-lg font-bold">
                <span className="text-crimson">IMPERIAL</span>
                <span className="text-gold ml-1">CODEX</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              O universo criativo de Baltazar. Um santuário digital para histórias épicas, 
              personagens memoráveis e mundos fantásticos que desafiam a imaginação.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/stories"
                  className="text-sm text-muted-foreground hover:text-crimson transition-colors"
                >
                  Histórias
                </Link>
              </li>
              <li>
                <Link
                  href="/wiki"
                  className="text-sm text-muted-foreground hover:text-crimson transition-colors"
                >
                  Codex Wiki
                </Link>
              </li>
              <li>
                <Link
                  href="/wiki?type=character"
                  className="text-sm text-muted-foreground hover:text-crimson transition-colors"
                >
                  Personagens
                </Link>
              </li>
              <li>
                <Link
                  href="/wiki?type=location"
                  className="text-sm text-muted-foreground hover:text-crimson transition-colors"
                >
                  Locais
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/stories?category=dream"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Sonhos
                </Link>
              </li>
              <li>
                <Link
                  href="/stories?category=tale"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Contos
                </Link>
              </li>
              <li>
                <Link
                  href="/stories?category=chronicle"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Crônicas
                </Link>
              </li>
              <li>
                <Link
                  href="/stories?category=idea"
                  className="text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  Ideias
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-crimson/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Imperial Codex. Criado por{" "}
            <span className="text-gold font-medium">Baltazar</span>.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-muted-foreground hover:text-crimson transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-crimson transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-crimson transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
