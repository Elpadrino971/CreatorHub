import Link from "next/link";
import { ArrowRight, BarChart3, Calendar, DollarSign, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CreatorHub
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your All-in-One
          <br />
          Creator Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop juggling 10 platforms. Manage YouTube, Twitch, TikTok & Instagram analytics,
          revenue, and content calendar in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-up"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="#demo"
            className="border-2 border-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition"
          >
            Watch Demo
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          14-day free trial • No credit card required • Cancel anytime
        </p>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Creators spend 30% of their time on admin instead of creating
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-600">
            <div className="flex gap-3">
              <span className="text-red-500 text-xl">✗</span>
              <span>Analytics scattered across 5-10 platforms</span>
            </div>
            <div className="flex gap-3">
              <span className="text-red-500 text-xl">✗</span>
              <span>Revenue tracking in spreadsheets</span>
            </div>
            <div className="flex gap-3">
              <span className="text-red-500 text-xl">✗</span>
              <span>Content planning in Google Sheets</span>
            </div>
            <div className="flex gap-3">
              <span className="text-red-500 text-xl">✗</span>
              <span>Comments/DMs across multiple apps</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything you need in one dashboard
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">Unified Analytics</h3>
            <p className="text-gray-600">
              See all your stats from YouTube, Twitch, TikTok & Instagram in one place.
              Track growth, engagement, and best performing content.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <Calendar className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">Content Calendar</h3>
            <p className="text-gray-600">
              Plan and schedule content across all platforms. Never miss a post with
              smart reminders and templates.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <DollarSign className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-3">Revenue Tracking</h3>
            <p className="text-gray-600">
              Consolidate income from ads, sponsors, merch, and donations.
              Get revenue forecasts based on your growth.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Simple, transparent pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-gray-600 mb-4">Perfect for starting out</p>
            <div className="text-4xl font-bold mb-6">$0</div>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>1 platform connection</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>Basic analytics</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>30-day history</span>
              </li>
            </ul>
            <Link
              href="/sign-up"
              className="block w-full text-center border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition"
            >
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-xl shadow-xl text-white transform scale-105">
            <div className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-blue-100 mb-4">For serious creators</p>
            <div className="text-4xl font-bold mb-6">
              $29<span className="text-lg">/mo</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-2">
                <span>✓</span>
                <span>3 platform connections</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Advanced analytics</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Content calendar</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Revenue tracking</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>1-year history</span>
              </li>
            </ul>
            <Link
              href="/sign-up"
              className="block w-full text-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Premium */}
          <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <p className="text-gray-600 mb-4">For power users</p>
            <div className="text-4xl font-bold mb-6">
              $79<span className="text-lg">/mo</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>Unlimited platforms</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>AI insights</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>Team collaboration</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">✓</span>
                <span>Unlimited history</span>
              </li>
            </ul>
            <Link
              href="/sign-up"
              className="block w-full text-center border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-gray-400 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to take control of your creator business?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of creators who save 10+ hours per week with CreatorHub
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 CreatorHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
