import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { DataProvider } from "@/contexts/data-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Kişisel CRM Sistemi",
  description: "Başvurularınızı, görevlerinizi ve projelerinizi yönetin",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <Navigation />
            <main>{children}</main>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
