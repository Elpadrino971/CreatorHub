// Mock data for CreatorHub MVP
// This simulates real API responses from YouTube & Twitch

export const MOCK_USER = {
  id: 'user_123',
  name: 'Alex Creator',
  email: 'alex@creator.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  plan: 'pro',
  createdAt: '2024-01-15'
}

export const MOCK_PLATFORMS = {
  youtube: {
    connected: true,
    channelId: 'UC123456789',
    channelName: 'Alex Gaming FR',
    channelAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=youtube',
    connectedAt: '2024-06-01'
  },
  twitch: {
    connected: true,
    channelId: 'alexgamingfr',
    channelName: 'AlexGamingFR',
    channelAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=twitch',
    connectedAt: '2024-06-05'
  },
  tiktok: {
    connected: false
  },
  instagram: {
    connected: false
  }
}

export const MOCK_YOUTUBE_STATS = {
  subscribers: 127500,
  subscribersGrowth: 2.3,
  totalViews: 15420000,
  viewsLast30Days: 892000,
  viewsGrowth: 5.7,
  watchTimeHours: 45200,
  watchTimeGrowth: 3.2,
  avgViewDuration: '8:42',
  estimatedRevenue: 3420,
  revenueGrowth: 8.1,
  videosPublished: 342,
  videosLast30Days: 12
}

export const MOCK_TWITCH_STATS = {
  followers: 45200,
  followersGrowth: 4.1,
  totalViews: 2340000,
  viewsLast30Days: 156000,
  viewsGrowth: 12.3,
  avgViewers: 1250,
  peakViewers: 4520,
  hoursStreamed: 156,
  subsCount: 892,
  subsGrowth: 6.2,
  estimatedRevenue: 2680,
  revenueGrowth: 15.4
}

export const MOCK_COMBINED_STATS = {
  totalFollowers: MOCK_YOUTUBE_STATS.subscribers + MOCK_TWITCH_STATS.followers,
  totalFollowersGrowth: 2.8,
  totalViews30Days: MOCK_YOUTUBE_STATS.viewsLast30Days + MOCK_TWITCH_STATS.viewsLast30Days,
  totalViewsGrowth: 7.2,
  totalRevenue: MOCK_YOUTUBE_STATS.estimatedRevenue + MOCK_TWITCH_STATS.estimatedRevenue,
  totalRevenueGrowth: 10.5,
  engagementRate: 4.8,
  engagementGrowth: 1.2
}

// Generate 30 days of analytics data
const generateDailyData = () => {
  const data = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    const baseYouTube = 25000 + Math.random() * 15000
    const baseTwitch = 4000 + Math.random() * 3000
    
    data.push({
      date: date.toISOString().split('T')[0],
      dateLabel: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      youtube: Math.round(baseYouTube * (1 + (29 - i) * 0.01)),
      twitch: Math.round(baseTwitch * (1 + (29 - i) * 0.015)),
      total: Math.round((baseYouTube + baseTwitch) * (1 + (29 - i) * 0.012)),
      youtubeRevenue: Math.round((baseYouTube / 1000) * 3.5),
      twitchRevenue: Math.round((baseTwitch / 1000) * 8)
    })
  }
  
  return data
}

export const MOCK_DAILY_ANALYTICS = generateDailyData()

export const MOCK_TOP_YOUTUBE_VIDEOS = [
  {
    id: 'yt1',
    title: 'J\'ai testé le nouveau GPU RTX 5090 - Ça vaut le coup ?',
    thumbnail: 'https://picsum.photos/seed/yt1/320/180',
    views: 245000,
    likes: 12400,
    comments: 1850,
    publishedAt: '2025-06-01',
    duration: '18:42',
    revenue: 892
  },
  {
    id: 'yt2',
    title: 'Setup Tour 2025 - Mon bureau de rêve enfin terminé !',
    thumbnail: 'https://picsum.photos/seed/yt2/320/180',
    views: 189000,
    likes: 15200,
    comments: 2340,
    publishedAt: '2025-05-28',
    duration: '24:15',
    revenue: 756
  },
  {
    id: 'yt3',
    title: 'Top 10 des meilleurs jeux à venir en 2025',
    thumbnail: 'https://picsum.photos/seed/yt3/320/180',
    views: 156000,
    likes: 8900,
    comments: 1120,
    publishedAt: '2025-05-25',
    duration: '15:30',
    revenue: 624
  },
  {
    id: 'yt4',
    title: 'Comment j\'ai doublé mes revenus YouTube en 6 mois',
    thumbnail: 'https://picsum.photos/seed/yt4/320/180',
    views: 134000,
    likes: 11200,
    comments: 890,
    publishedAt: '2025-05-20',
    duration: '21:08',
    revenue: 536
  },
  {
    id: 'yt5',
    title: 'Live coding: Je crée une app en 24h',
    thumbnail: 'https://picsum.photos/seed/yt5/320/180',
    views: 98000,
    likes: 7600,
    comments: 2100,
    publishedAt: '2025-05-15',
    duration: '45:22',
    revenue: 412
  }
]

export const MOCK_TOP_TWITCH_STREAMS = [
  {
    id: 'tw1',
    title: 'Marathon GTA 6 - Premier jour de sortie !',
    thumbnail: 'https://picsum.photos/seed/tw1/320/180',
    peakViewers: 4520,
    avgViewers: 2340,
    duration: '8h 45m',
    date: '2025-06-02',
    category: 'GTA VI',
    revenue: 456
  },
  {
    id: 'tw2',
    title: 'Ranked Valorant avec les viewers',
    thumbnail: 'https://picsum.photos/seed/tw2/320/180',
    peakViewers: 2890,
    avgViewers: 1560,
    duration: '5h 20m',
    date: '2025-05-30',
    category: 'Valorant',
    revenue: 312
  },
  {
    id: 'tw3',
    title: 'Just Chatting - Q&A avec la commu',
    thumbnail: 'https://picsum.photos/seed/tw3/320/180',
    peakViewers: 1890,
    avgViewers: 1120,
    duration: '3h 15m',
    date: '2025-05-28',
    category: 'Just Chatting',
    revenue: 234
  },
  {
    id: 'tw4',
    title: 'Découverte Elden Ring DLC',
    thumbnail: 'https://picsum.photos/seed/tw4/320/180',
    peakViewers: 3200,
    avgViewers: 1890,
    duration: '6h 30m',
    date: '2025-05-25',
    category: 'Elden Ring',
    revenue: 378
  },
  {
    id: 'tw5',
    title: 'Tournoi Mario Kart avec les subs',
    thumbnail: 'https://picsum.photos/seed/tw5/320/180',
    peakViewers: 2100,
    avgViewers: 1340,
    duration: '4h 00m',
    date: '2025-05-22',
    category: 'Mario Kart 8',
    revenue: 267
  }
]

export const MOCK_BEST_POSTING_TIMES = {
  youtube: [
    { day: 'Samedi', time: '14:00', score: 95 },
    { day: 'Dimanche', time: '15:00', score: 92 },
    { day: 'Mercredi', time: '18:00', score: 88 },
    { day: 'Vendredi', time: '17:00', score: 85 }
  ],
  twitch: [
    { day: 'Samedi', time: '20:00', score: 98 },
    { day: 'Dimanche', time: '19:00', score: 94 },
    { day: 'Vendredi', time: '21:00', score: 91 },
    { day: 'Jeudi', time: '20:00', score: 87 }
  ]
}

export const MOCK_AUDIENCE_DEMOGRAPHICS = {
  ageGroups: [
    { range: '13-17', percentage: 8 },
    { range: '18-24', percentage: 35 },
    { range: '25-34', percentage: 38 },
    { range: '35-44', percentage: 14 },
    { range: '45+', percentage: 5 }
  ],
  gender: [
    { type: 'Homme', percentage: 72 },
    { type: 'Femme', percentage: 26 },
    { type: 'Autre', percentage: 2 }
  ],
  topCountries: [
    { country: 'France', percentage: 45, flag: '🇫🇷' },
    { country: 'Belgique', percentage: 12, flag: '🇧🇪' },
    { country: 'Canada', percentage: 10, flag: '🇨🇦' },
    { country: 'Suisse', percentage: 8, flag: '🇨🇭' },
    { country: 'États-Unis', percentage: 7, flag: '🇺🇸' }
  ]
}

export const MOCK_REVENUE_BREAKDOWN = {
  youtube: [
    { source: 'AdSense', amount: 2450, percentage: 72 },
    { source: 'Sponsors', amount: 650, percentage: 19 },
    { source: 'Super Chat', amount: 180, percentage: 5 },
    { source: 'Memberships', amount: 140, percentage: 4 }
  ],
  twitch: [
    { source: 'Subscriptions', amount: 1450, percentage: 54 },
    { source: 'Bits', amount: 520, percentage: 19 },
    { source: 'Ads', amount: 380, percentage: 14 },
    { source: 'Sponsors', amount: 330, percentage: 12 }
  ]
}

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'pour toujours',
    features: [
      '1 plateforme connectée',
      'Analytics 30 jours',
      'Dashboard basique',
      'Support email'
    ],
    limitations: [
      'Pas de comparaison cross-platform',
      'Pas de calendrier',
      'Pas d\'export'
    ],
    cta: 'Commencer gratuitement',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    period: '/mois',
    features: [
      '3 plateformes connectées',
      'Analytics 1 an',
      'Calendrier de contenu',
      'Comparaison cross-platform',
      'Export PDF/CSV',
      'Support prioritaire'
    ],
    limitations: [],
    cta: 'Essai gratuit 14 jours',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    period: '/mois',
    features: [
      'Plateformes illimitées',
      'Analytics illimité',
      'AI Content Insights',
      'Gestion d\'équipe',
      'API access',
      'Support dédié 24/7',
      'Onboarding personnalisé'
    ],
    limitations: [],
    cta: 'Contacter les ventes',
    popular: false
  }
]
