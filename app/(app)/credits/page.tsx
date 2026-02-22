"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Check, Zap, Crown, Building, CreditCard, Sparkles, ExternalLink } from "lucide-react"

const creditPacks = [
  {
    id: "starter",
    name: "Starter",
    credits: 500,
    price: 29,
    pricePerCredit: 0.058,
    popular: false,
    icon: Zap,
    description: "Perfect for trying out LeadDrop",
    // Replace with your actual LemonSqueezy variant ID
    variantId: "STARTER_VARIANT_ID",
  },
  {
    id: "growth",
    name: "Growth",
    credits: 2000,
    price: 99,
    pricePerCredit: 0.0495,
    popular: true,
    icon: Crown,
    description: "Most popular for growing businesses",
    savings: "15% savings",
    variantId: "GROWTH_VARIANT_ID",
  },
  {
    id: "scale",
    name: "Scale",
    credits: 5000,
    price: 199,
    pricePerCredit: 0.0398,
    popular: false,
    icon: Building,
    description: "Best value for high-volume users",
    savings: "31% savings",
    variantId: "SCALE_VARIANT_ID",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 15000,
    price: 499,
    pricePerCredit: 0.0333,
    popular: false,
    icon: Sparkles,
    description: "For agencies and large teams",
    savings: "42% savings",
    variantId: "ENTERPRISE_VARIANT_ID",
  },
]

export default function CreditsPage() {
  const { user, addCredits } = useAuth()
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handlePurchase = async (packId: string, variantId: string, credits: number) => {
    setIsProcessing(packId)

    try {
      // Call API to create LemonSqueezy checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          userId: user?.id,
          userEmail: user?.email,
          credits,
        }),
      })

      const data = await response.json()

      if (data.checkoutUrl) {
        // Redirect to LemonSqueezy checkout
        window.location.href = data.checkoutUrl
      } else {
        // Fallback for demo: simulate purchase
        await new Promise((resolve) => setTimeout(resolve, 1500))
        addCredits(credits)
        alert(`Successfully added ${credits.toLocaleString()} credits! (Demo mode)`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      // Demo fallback
      await new Promise((resolve) => setTimeout(resolve, 1500))
      addCredits(credits)
      alert(`Successfully added ${credits.toLocaleString()} credits! (Demo mode)`)
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">
          <CreditCard className="h-3 w-3 mr-1" />
          Credits
        </Badge>
        <h1 className="text-3xl font-bold text-foreground">Buy Credits</h1>
        <p className="text-muted-foreground">Purchase credits to export leads from any niche. No expiration.</p>
      </div>

      {/* Current balance */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
              <p className="text-4xl font-bold text-foreground">{user?.credits.toLocaleString() || 0}</p>
              <p className="text-sm text-muted-foreground">credits available</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit packs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {creditPacks.map((pack) => {
          const Icon = pack.icon
          const isLoading = isProcessing === pack.id

          return (
            <Card
              key={pack.id}
              className={`relative bg-card border-border hover:border-primary/50 transition-all ${
                pack.popular ? "ring-2 ring-primary" : ""
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{pack.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{pack.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">${pack.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pack.credits.toLocaleString()} credits
                    {pack.savings && (
                      <Badge variant="outline" className="ml-2 text-green-500 border-green-500/30 bg-green-500/10">
                        {pack.savings}
                      </Badge>
                    )}
                  </p>
                </div>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />${pack.pricePerCredit.toFixed(3)} per credit
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    Never expires
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    Instant delivery
                  </li>
                </ul>

                <Button
                  className={`w-full ${
                    pack.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                  onClick={() => handlePurchase(pack.id, pack.variantId, pack.credits)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Redirecting..."
                  ) : (
                    <>
                      Buy {pack.credits.toLocaleString()} Credits
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-card border-border">
        <CardContent className="py-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">How credits work</h3>
              <p className="text-sm text-muted-foreground">
                1 credit = 1 lead export. Different niches may have different credit costs based on data quality and
                freshness.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Secure payments</h3>
              <p className="text-sm text-muted-foreground">
                All payments are processed securely through LemonSqueezy. We support credit cards, PayPal, and more.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Need more?</h3>
              <p className="text-sm text-muted-foreground">
                Contact us for custom enterprise packages with volume discounts and dedicated support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
