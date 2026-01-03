import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Calendar, Download } from "lucide-react"

const subscriptions = [
  {
    id: 1,
    niche: "SaaS Founders - USA",
    frequency: "Weekly",
    leadsPerDelivery: 500,
    nextDelivery: "Jan 10, 2026",
    status: "active",
    pastDeliveries: [
      { date: "Jan 3, 2026", leads: 500 },
      { date: "Dec 27, 2025", leads: 500 },
      { date: "Dec 20, 2025", leads: 500 },
    ],
  },
  {
    id: 2,
    niche: "Marketing Directors - UK",
    frequency: "Weekly",
    leadsPerDelivery: 300,
    nextDelivery: "Jan 12, 2026",
    status: "active",
    pastDeliveries: [
      { date: "Jan 5, 2026", leads: 300 },
      { date: "Dec 29, 2025", leads: 300 },
      { date: "Dec 22, 2025", leads: 300 },
    ],
  },
  {
    id: 3,
    niche: "E-commerce CEOs - Germany",
    frequency: "Weekly",
    leadsPerDelivery: 400,
    nextDelivery: "Jan 15, 2026",
    status: "active",
    pastDeliveries: [
      { date: "Jan 8, 2026", leads: 400 },
      { date: "Jan 1, 2026", leads: 400 },
      { date: "Dec 25, 2025", leads: 400 },
    ],
  },
]

export default function SubscriptionsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Subscriptions</h1>
        <p className="text-muted-foreground">Manage your weekly lead delivery subscriptions.</p>
      </div>

      <div className="space-y-6">
        {subscriptions.map((sub) => (
          <Card key={sub.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{sub.niche}</CardTitle>
                    <Badge variant={sub.status === "active" ? "default" : "secondary"}>{sub.status}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      {sub.frequency}
                    </span>
                    <span>{sub.leadsPerDelivery} leads per delivery</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Upgrade
                  </Button>
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Next Delivery */}
              <div className="bg-accent rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent-foreground mb-1">Next Delivery</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {sub.nextDelivery}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent-foreground">{sub.leadsPerDelivery}</p>
                    <p className="text-xs text-muted-foreground">leads</p>
                  </div>
                </div>
              </div>

              {/* Past Deliveries */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Past Deliveries</h4>
                <div className="space-y-2">
                  {sub.pastDeliveries.map((delivery, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md">
                      <div>
                        <p className="text-sm text-foreground">{delivery.date}</p>
                        <p className="text-xs text-muted-foreground">{delivery.leads} leads delivered</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
