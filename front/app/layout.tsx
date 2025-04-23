import "@/app/globals.css"
import { ThemeProvider } from "next-themes"
import Providers from "./providers"

export const metadata = {
  title: "EventHub - Sistema de Gestão de Eventos",
  description: "Plataforma para criar, gerenciar e se inscrever em eventos",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'