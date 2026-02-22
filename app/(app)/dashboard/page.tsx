"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Coins, Download, RefreshCw, TrendingUp, Globe, Zap } from "lucide-react"
import { useUser } from "@/lib/hooks/use-user"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  credits: number
  activeSubscriptions: number
  totalDownloads: number
}

interface RecentSubscription {
  id: string
  niche: {
    name: string
    region: string
    roles: string[]
    lead_count: number
  }
  updated_at: string
}

export default function DashboardPage() {
  const { profile, loading } = useUser()
  const [stats, setStats] = useState<DashboardStats>({ credits: 0, activeSubscriptions: 0, totalDownloads: 0 })
  const [recentSubs, setRecentSubs] = useState<RecentSubscription[]>([])

  useEffect(() => {
    if (profile) {
      fetchDashboardData()
    }
  }, [profile])

  const fetchDashboardData = async () => {
    const supabase = createClient()

    // Get subscription count
    const { count: subCount } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile!.id)
      .eq("status", "active")

    // Get download count (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const { count: downloadCount } = await supabase
      .from("downloads")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile!.id)
      .gte("created_at", thirtyDaysAgo.toISOString())

    setStats({
      credits: profile!.credits,
      activeSubscriptions: subCount || 0,
      totalDownloads: downloadCount || 0,
    })

    // Get recent niches (from downloads)
    const { data: downloads } = await supabase
      .from("downloads")
      .select(`
        id,
        created_at,
        niche:niches(name, region, roles, lead_count)
      `)
      .eq("user_id", profile!.id)
      .order("created_at", { ascending: false })
      .limit(3)

    if (downloads) {
      setRecentSubs(
        downloads.map((d: any) => ({
          id: d.id,
          niche: d.niche,
          updated_at: new Date(d.created_at).toLocaleDateString(),
        })),
      )
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name?.split(" ")[0] || "User"}! Here's your account overview.
          </p>
        </div>
        <Link href="/niches">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Instant Leads
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Coins className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.credits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/credits" className="text-primary hover:underline">
                Buy more credits
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">Weekly lead deliveries</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Downloads</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Download className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalDownloads}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reply Rate</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">+127%</div>
            <p className="text-xs text-green-500 mt-1">Above industry average</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/niches">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-muted-foreground/30">01</span>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg text-foreground">Choose Your Niche</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Browse curated B2B lead lists by industry, role, and geography.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/credits">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-muted-foreground/30">02</span>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg text-foreground">Pay Once or Subscribe</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Instant checkout for one-time downloads or weekly subscriptions.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/downloads">
            <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-muted-foreground/30">03</span>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg text-foreground">Download Instantly</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Get your leads instantly delivered as a clean, ready-to-use CSV.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {recentSubs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Downloads</h2>
            <Link href="/downloads">
              <Button variant="outline" className="border-border text-foreground hover:bg-accent bg-transparent">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recentSubs.map((sub) => (
              <Card key={sub.id} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Globe className="h-4 w-4" />
                    {sub.niche?.region || "N/A"}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{sub.niche?.name || "Unknown"}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{sub.niche?.roles?.join(", ") || "N/A"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">
                      {sub.niche?.lead_count?.toLocaleString() || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">{sub.updated_at}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
