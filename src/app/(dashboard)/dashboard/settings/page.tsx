'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Youtube, Twitch, Instagram, Video, Settings, Zap } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos plateformes et préférences</p>
      </div>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>Plan actuel et facturation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">Pro</h3>
                <Badge>Actif</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                3 plateformes • Analytics avancées • Calendrier
              </p>
              <p className="text-lg font-semibold mt-2">$29/mois</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Gérer</Button>
              <Button>Passer au Premium</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>Plateformes Connectées</CardTitle>
          <CardDescription>Gérez vos connexions aux plateformes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* YouTube */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Youtube className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-semibold">YouTube</h4>
                <p className="text-sm text-muted-foreground">
                  Connecté • 127.5K abonnés
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-600">Actif</Badge>
              <Button variant="outline" size="sm">Déconnecter</Button>
            </div>
          </div>

          {/* Twitch */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Twitch className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold">Twitch</h4>
                <p className="text-sm text-muted-foreground">
                  Connecté • 45.2K followers
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-600">Actif</Badge>
              <Button variant="outline" size="sm">Déconnecter</Button>
            </div>
          </div>

          {/* TikTok - Not Connected */}
          <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Video className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold">TikTok</h4>
                <p className="text-sm text-muted-foreground">
                  Non connecté
                </p>
              </div>
            </div>
            <Button variant="default">Connecter</Button>
          </div>

          {/* Instagram - Not Connected */}
          <div className="flex items-center justify-between p-4 border rounded-lg border-dashed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Instagram className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-semibold">Instagram</h4>
                <p className="text-sm text-muted-foreground">
                  Non connecté
                </p>
              </div>
            </div>
            <Button variant="default">Connecter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
          <CardDescription>Notifications et affichage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Notifications par email</h4>
              <p className="text-sm text-muted-foreground">
                Recevoir les résumés hebdomadaires
              </p>
            </div>
            <Button variant="outline" size="sm">Activé</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Mode sombre</h4>
              <p className="text-sm text-muted-foreground">
                Thème sombre pour l'interface
              </p>
            </div>
            <Button variant="outline" size="sm">Désactivé</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Devise</h4>
              <p className="text-sm text-muted-foreground">
                Devise d'affichage des revenus
              </p>
            </div>
            <Button variant="outline" size="sm">USD ($)</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>Actions irréversibles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Supprimer toutes les données</h4>
              <p className="text-sm text-muted-foreground">
                Effacer toutes vos données de notre système
              </p>
            </div>
            <Button variant="destructive" size="sm">Supprimer</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Fermer le compte</h4>
              <p className="text-sm text-muted-foreground">
                Supprimer définitivement votre compte
              </p>
            </div>
            <Button variant="destructive" size="sm">Fermer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
