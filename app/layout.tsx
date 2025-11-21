import { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}

export const metadata = {
  title: 'VIBELOOK AI Stylist',
  description: 'Персональный AI-стилист для подбора образов',
}

