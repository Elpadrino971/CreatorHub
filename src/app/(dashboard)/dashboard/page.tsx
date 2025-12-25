import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Get or create user in database
  let user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      platformConnections: {
        where: { isActive: true },
      },
      subscription: true,
    },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim() || null,
        avatarUrl: clerkUser.imageUrl,
      },
      include: {
        platformConnections: true,
        subscription: true,
      },
    });
  }

  // Get aggregated stats (mock data for now)
  const totalFollowers = 0;
  const totalViews7d = 0;
  const totalRevenue30d = 0;
  const engagementRate = 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.name || clerkUser.firstName}!
        </h1>
        <p className="text-gray-600">
          Here&apos;s your creator performance overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Followers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalFollowers)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Views (7 days)
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalViews7d)}
            </div>
            <p className="text-xs text-muted-foreground">
              +0% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue (30 days)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue30d)}
            </div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across content
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Platforms</CardTitle>
          <CardDescription>
            {user.platformConnections.length === 0
              ? "Connect your first platform to get started"
              : `${user.platformConnections.length} platform(s) connected`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.platformConnections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                No platforms connected yet
              </p>
              <a
                href="/dashboard/integrations"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Connect Your First Platform
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {user.platformConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {connection.platform.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{connection.platform}</p>
                      <p className="text-sm text-gray-500">
                        @{connection.platformUsername || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-green-600">
                    Active
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
