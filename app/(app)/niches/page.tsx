"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExportModal } from "@/components/niches/export-modal"
import { Coins, MapPin, Users } from "lucide-react"

const niches = [
  {
    id: 1,
    name: "SaaS Founders",
    country: "USA",
    roles: ["CEO", "Founder", "Co-Founder"],
    availableLeads: 12500,
    creditCost: 100,
  },
  {
    id: 2,
    name: "Marketing Directors",
    country: "UK",
    roles: ["CMO", "Marketing Director", "Head of Marketing"],
    availableLeads: 8300,
    creditCost: 80,
  },
  {
    id: 3,
    name: "E-commerce CEOs",
    country: "Germany",
    roles: ["CEO", "Managing Director"],
    availableLeads: 5600,
    creditCost: 90,
  },
  {
    id: 4,
    name: "Tech CTOs",
    country: "Canada",
    roles: ["CTO", "VP Engineering", "Head of Tech"],
    availableLeads: 9200,
    creditCost: 95,
  },
  {
    id: 5,
    name: "Finance Directors",
    country: "Australia",
    roles: ["CFO", "Finance Director", "Controller"],
    availableLeads: 6800,
    creditCost: 85,
  },
  {
    id: 6,
    name: "Sales VPs",
    country: "USA",
    roles: ["VP Sales", "Sales Director", "Head of Sales"],
    availableLeads: 11400,
    creditCost: 100,
  },
]

export default function NichesPage() {
  const [selectedNiche, setSelectedNiche] = useState<(typeof niches)[0] | null>(null)

  return (
    <>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Niches</h1>
          <p className="text-muted-foreground">Select a niche and export targeted B2B leads using your credits.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {niches.map((niche) => (
            <Card key={niche.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{niche.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      {niche.country}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Coins className="h-3 w-3 mr-1" />
                    {niche.creditCost}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Roles Covered
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {niche.roles.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    <span className="font-semibold text-foreground">{niche.availableLeads.toLocaleString()}</span> leads
                    available
                  </p>
                  <Button onClick={() => setSelectedNiche(niche)} className="w-full">
                    Export Leads
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ExportModal niche={selectedNiche} open={!!selectedNiche} onClose={() => setSelectedNiche(null)} />
    </>
  )
}
