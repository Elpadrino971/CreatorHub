import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'CreatorHub - Dashboard pour Créateurs',
  description: 'Unifiez vos analytics YouTube, Twitch et plus encore',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
