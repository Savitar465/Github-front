import { Geist, JetBrains_Mono, Roboto } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/common/navbar"

const robotoHeading = Roboto({ subsets: ['latin'], variable: '--font-heading', weight: ['400', '500', '700'] })
const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: "GitHubX - Gestión de Repositorios",
  description: "Plataforma de gestión de repositorios y archivos estilo GitHub",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        jetbrainsMono.variable,
        robotoHeading.variable
      )}
    >
      <body className="min-h-screen bg-background font-sans">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
