"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Calendar, ArrowRight, Loader2 } from "lucide-react"
import { useUser } from "@/lib/hooks/use-user"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Subscription {
  id: string
  plan_name: string
  status: string
  credits_per_month: number
  price_per_month: number
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
}

export default function SubscriptionsPage() {
  const { profile } = useUser()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      fetchSubscriptions()
    }
  }, [profile])

  const fetchSubscriptions = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", profile!.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setSubscriptions(data)
    }
    setLoading(false)
  }

  const formatDate = (date: string | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your credit subscription plans.</p>
        </div>
        <Link href="/credits">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Add Subscription
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No active subscriptions</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to a plan to get monthly credits at a discounted rate.
            </p>
            <Link href="/credits">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">View Plans</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((sub) => (
            <Card key={sub.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl text-foreground">{sub.plan_name}</CardTitle>
                      <Badge
                        className={
                          sub.status === "active"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : sub.status === "cancelled"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Monthly
                      </span>
                      <span>{sub.credits_per_month.toLocaleString()} credits per month</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-accent bg-transparent"
                    >
                      Manage
                    </Button>
                    {sub.status === "active" && (
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subscription details */}
                <div className="bg-accent rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-accent-foreground mb-1">Current Period</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(sub.current_period_start)} - {formatDate(sub.current_period_end)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent-foreground">${sub.price_per_month.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">per month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
