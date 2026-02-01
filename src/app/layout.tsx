import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Imperial Codex | O Universo de Baltazar",
    template: "%s | Imperial Codex",
  },
  description:
    "Explore o universo criativo de Baltazar. Histórias épicas, personagens únicos, mundos fantásticos e muito mais. Um codex digital de sonhos, ideias e crônicas.",
  keywords: [
    "histórias",
    "wiki",
    "fantasia",
    "personagens",
    "worldbuilding",
    "Baltazar",
    "Imperial Codex",
  ],
  authors: [{ name: "Baltazar" }],
  creator: "Baltazar",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Imperial Codex",
    title: "Imperial Codex | O Universo de Baltazar",
    description:
      "Explore o universo criativo de Baltazar. Histórias épicas, personagens únicos e mundos fantásticos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imperial Codex",
    description: "O universo criativo de Baltazar",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/Crown.svg",
    apple: "/Crown.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
