import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Home,
  Lightbulb,
  Settings,
  Zap
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">CreatorHub</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <BarChart3 className="h-5 w-5" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/dashboard/calendar"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <Calendar className="h-5 w-5" />
            <span>Content Calendar</span>
          </Link>
          <Link
            href="/dashboard/revenue"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <DollarSign className="h-5 w-5" />
            <span>Revenue</span>
          </Link>
          <Link
            href="/dashboard/insights"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <Lightbulb className="h-5 w-5" />
            <span>Insights</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm font-medium">Account</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">{children}</main>
    </div>
  );
}
