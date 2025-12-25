# CreatorHub - All-in-One Creator Dashboard

> **Stop juggling 10 platforms.** Manage your YouTube, Twitch, TikTok, and Instagram analytics, revenue, and content calendar from one powerful dashboard.

## 🎯 Problem We Solve

Content creators currently spend **30% of their time** on administrative tasks instead of creating content:

- Analytics scattered across 5-10 different platforms
- Revenue tracking done manually in spreadsheets
- Content planning in Google Sheets or Notion
- Engagement and community management across multiple apps

**CreatorHub consolidates everything into one unified dashboard.**

## ✨ Features

### MVP (Phase 1)
- ✅ **Unified Dashboard**: Connect YouTube, Twitch, TikTok via OAuth
- ✅ **Consolidated Analytics**: Total followers, views (7/30 days), revenue estimates
- ✅ **Performance Tracking**: Top 5 content pieces, cross-platform comparison
- ✅ **Content Calendar**: Visual planning, templates, publication reminders
- ✅ **Three Pricing Tiers**: Free (1 platform), Pro ($29/mo), Premium ($79/mo)

### Phase 2 (Future)
- 🔮 Revenue Management: Multi-source consolidation, forecasting, expense tracking
- 🔮 Community Inbox: Unified comments/DMs from all platforms
- 🔮 AI Content Assistant: Title/thumbnail suggestions, trend analysis
- 🔮 Team Collaboration: Multi-user access, workflows

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Serverless functions
- **PostgreSQL** - Database (via Supabase)
- **Prisma** - ORM
- **Clerk** - Authentication

### Platform Integrations
- YouTube Data API v3
- Twitch API
- TikTok Business API
- Instagram Graph API

### Hosting
- **Vercel** - Frontend + API
- **Supabase** - Database + Auth
- **Stripe** - Payments

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Clerk account
- Platform API credentials (YouTube, Twitch, TikTok)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/creatorhub.git
cd creatorhub
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- Database URL (Supabase)
- Clerk keys
- Stripe keys
- Platform API credentials

4. **Setup database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for complete schema documentation.

### Core Tables
- `users` - User profiles and subscription info
- `platform_connections` - OAuth tokens for each platform
- `analytics` - Daily aggregated metrics
- `content` - Videos, streams, posts
- `calendar_events` - Content planning
- `revenue` - Income tracking
- `insights` - AI-generated recommendations

## 🗺 Roadmap

### Week 1-2: Foundation
- [x] Project setup (Next.js + Prisma)
- [x] Database schema design
- [x] Landing page
- [ ] Clerk authentication
- [ ] Basic dashboard UI

### Week 3-4: Platform Integrations
- [ ] YouTube OAuth flow
- [ ] Twitch OAuth flow
- [ ] TikTok OAuth flow
- [ ] Data fetching from APIs
- [ ] Analytics storage

### Week 5-6: Core Features
- [ ] Dashboard with KPIs
- [ ] Analytics page with charts
- [ ] Content performance tracking
- [ ] Platform comparison views

### Week 7-8: Launch Prep
- [ ] Content calendar
- [ ] Stripe integration
- [ ] Tier limits enforcement
- [ ] Beta testing

## 💰 Business Model

### Pricing Tiers

| Feature | Free | Pro ($29/mo) | Premium ($79/mo) |
|---------|------|-------------|------------------|
| Platforms | 1 | 3 | Unlimited |
| Analytics | Basic | Advanced | Advanced + AI |
| Calendar | ❌ | ✅ | ✅ |
| Revenue Tracking | ❌ | ✅ | ✅ |
| History | 30 days | 1 year | Unlimited |
| Team Access | ❌ | ❌ | ✅ |

### Target Market
- 5-10M "serious" creators worldwide (>1K subscribers)
- 2-5% willing to pay for tools
- **Addressable market**: 100K-500K potential customers

### Year 1 Goals
- Month 1-3: Build MVP
- Month 4-6: Beta (50 free users)
- Month 7-9: Launch paid (100 paying = $2.9K MRR)
- Month 10-12: Scale (300 paying = $8.7K MRR)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 💬 Support

- Documentation: [docs.creatorhub.com](https://docs.creatorhub.com)
- Email: support@creatorhub.com
- Discord: [Join our community](https://discord.gg/creatorhub)

## 🌟 Why This Can Succeed

1. **Real Problem**: Creators genuinely waste time on admin
2. **Growing Market**: 50M+ active creators globally
3. **No Strong Competitor**: Existing tools are platform-specific or outdated
4. **High Retention**: SaaS for essential workflow = sticky
5. **Global Reach**: Works for creators anywhere

---

**Built with ❤️ for creators, by a creator**

*Stop managing platforms. Start creating content.*
