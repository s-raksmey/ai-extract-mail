import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Gmail Extractor",
  description: "AI chat demo interface",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
