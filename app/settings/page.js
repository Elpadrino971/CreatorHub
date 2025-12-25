'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  Youtube,
  Twitch,
  Instagram,
  Music2,
  Check,
  X,
  ExternalLink,
  Shield,
  Bell,
  CreditCard,
  User,
  Zap
} from 'lucide-react'

const platforms = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    description: 'Connectez votre chaîne YouTube pour voir vos analytics'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: Twitch,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    description: 'Connectez votre compte Twitch pour voir vos stats de stream'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: Music2,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    description: 'Bientôt disponible - TikTok Analytics',
    comingSoon: true
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: 'Bientôt disponible - Instagram Insights',
    comingSoon: true
  }
]

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [connectedPlatforms, setConnectedPlatforms] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, platformsRes] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/platforms')
        ])
        const userData = await userRes.json()
        const platformsData = await platformsRes.json()
        setUser(userData)
        setConnectedPlatforms(platformsData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleConnect = async (platformId) => {
    toast.info(`Configuration OAuth ${platformId} requise`, {
      description: 'Ajoutez vos credentials API dans les paramètres pour activer cette intégration.'
    })
  }

  const handleDisconnect = async (platformId) => {
    toast.success(`${platformId} déconnecté`, {
      description: 'Vous pouvez reconnecter à tout moment.'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar user={null} />
        <main className="lg:pl-[260px] p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={user} />
      
      <main className="lg:pl-[260px] p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground">Gérez votre compte et vos intégrations</p>
          </div>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge className="mt-1 capitalize">{user?.plan} Plan</Badge>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success('Profil mis à jour')}>Sauvegarder</Button>
            </CardFooter>
          </Card>

          {/* Connected Platforms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Plateformes Connectées
              </CardTitle>
              <CardDescription>
                Connectez vos comptes pour synchroniser automatiquement vos analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {platforms.map((platform) => {
                const isConnected = connectedPlatforms?.[platform.id]?.connected
                const platformData = connectedPlatforms?.[platform.id]
                
                return (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${platform.bgColor}`}>
                        <platform.icon className={`h-6 w-6 ${platform.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{platform.name}</h4>
                          {platform.comingSoon && (
                            <Badge variant="secondary" className="text-xs">Bientôt</Badge>
                          )}
                        </div>
                        {isConnected ? (
                          <p className="text-sm text-muted-foreground">
                            Connecté: {platformData?.channelName}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {platform.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <>
                          <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                            <Check className="h-3 w-3" />
                            Connecté
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDisconnect(platform.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={platform.comingSoon}
                          onClick={() => handleConnect(platform.id)}
                        >
                          {platform.comingSoon ? 'Bientôt' : 'Connecter'}
                          {!platform.comingSoon && <ExternalLink className="h-4 w-4 ml-2" />}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Abonnement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <h4 className="font-medium">Plan Pro</h4>
                  <p className="text-sm text-muted-foreground">29$/mois - 3 plateformes, analytics complet</p>
                </div>
                <Button variant="outline">Gérer l'abonnement</Button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Plateformes</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold">1 an</p>
                  <p className="text-xs text-muted-foreground">Historique</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold">∞</p>
                  <p className="text-xs text-muted-foreground">Exports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">Recevez un résumé hebdomadaire</p>
                </div>
                <Switch id="email-notif" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="alert-notif">Alertes de performance</Label>
                  <p className="text-sm text-muted-foreground">Soyez alerté en cas de baisse/hausse</p>
                </div>
                <Switch id="alert-notif" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="milestone-notif">Milestones</Label>
                  <p className="text-sm text-muted-foreground">Célébrez vos accomplissements</p>
                </div>
                <Switch id="milestone-notif" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité</p>
                </div>
                <Button variant="outline" size="sm">Activer</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sessions actives</Label>
                  <p className="text-sm text-muted-foreground">1 session active</p>
                </div>
                <Button variant="outline" size="sm">Voir tout</Button>
              </div>
            </CardContent>
          </Card>

          {/* API Keys Info */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">🔑 Configuration API (Développeur)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Pour activer les vraies intégrations, ajoutez ces variables dans <code className="bg-muted px-1 rounded">.env</code>:</p>
              <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
{`# YouTube
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_secret

# Twitch
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_secret

# Clerk (Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
