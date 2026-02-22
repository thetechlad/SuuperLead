"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coins, CheckCircle2, Download, Globe, AlertCircle } from "lucide-react"
import { useUser } from "@/lib/hooks/use-user"
import { createClient } from "@/lib/supabase/client"
import { put } from "@vercel/blob"

interface Niche {
  id: string
  name: string
  region: string
  industry: string
  roles: string[]
  lead_count: number
  price_per_lead: number
}

interface ExportModalProps {
  niche: Niche | null
  open: boolean
  onClose: () => void
}

export function ExportModal({ niche, open, onClose }: ExportModalProps) {
  const router = useRouter()
  const { profile, refreshProfile } = useUser()
  const [leadCount, setLeadCount] = useState(500)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (!niche) return null

  const creditCost = Math.ceil(niche.price_per_lead * 100) // credits per 100 leads
  const totalCost = Math.ceil((leadCount / 100) * creditCost)
  const userCredits = profile?.credits || 0
  const hasEnoughCredits = userCredits >= totalCost

  const handleExport = async () => {
    if (!profile) return

    setIsExporting(true)
    setError(null)

    try {
      const supabase = createClient()

      // Generate CSV content
      const csvContent = generateCSV(niche, leadCount)
      const fileName = `${niche.name.toLowerCase().replace(/\s+/g, "-")}-${leadCount}-leads-${Date.now()}.csv`

      // Upload to Vercel Blob
      const blob = await put(fileName, csvContent, {
        access: "public",
        contentType: "text/csv",
      })

      // Deduct credits from user profile
      const { error: creditError } = await supabase
        .from("profiles")
        .update({ credits: userCredits - totalCost })
        .eq("id", profile.id)

      if (creditError) throw creditError

      // Create download record
      const { error: downloadError } = await supabase.from("downloads").insert({
        user_id: profile.id,
        niche_id: niche.id,
        lead_count: leadCount,
        credits_used: totalCost,
        file_url: blob.url,
        file_name: fileName,
        status: "completed",
      })

      if (downloadError) throw downloadError

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: profile.id,
        type: "export",
        credits: -totalCost,
        description: `Exported ${leadCount} leads from ${niche.name}`,
      })

      setDownloadUrl(blob.url)
      setExportSuccess(true)
      await refreshProfile()
    } catch (err) {
      console.error("Export error:", err)
      setError("Failed to export leads. Please try again.")
    }

    setIsExporting(false)
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank")
    }
  }

  const handleClose = () => {
    setExportSuccess(false)
    setLeadCount(500)
    setDownloadUrl("")
    setError(null)
    onClose()
  }

  if (exportSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-popover border-border">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-popover-foreground">Export Complete!</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Your {leadCount} leads have been exported successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-accent rounded-lg p-4 space-y-2 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Globe className="h-4 w-4" />
                {niche.region}
              </div>
              <p className="font-medium text-accent-foreground">{niche.name}</p>
              <p className="text-sm text-muted-foreground">
                {leadCount} leads • {totalCost} credits used
              </p>
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent bg-transparent"
              onClick={() => {
                handleClose()
                router.push("/downloads")
              }}
            >
              View All Downloads
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-popover-foreground">Export Leads</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure your export from {niche.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Niche info */}
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Globe className="h-4 w-4" />
            {niche.region}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-count" className="text-popover-foreground">
              Number of Leads
            </Label>
            <Input
              id="lead-count"
              type="number"
              min={100}
              max={niche.lead_count}
              step={100}
              value={leadCount}
              onChange={(e) => setLeadCount(Number(e.target.value))}
              className="bg-input border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">Maximum: {niche.lead_count.toLocaleString()} leads</p>
          </div>

          <div className="bg-accent rounded-lg p-4 space-y-3 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-accent-foreground">Credit Cost</span>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-semibold text-accent-foreground">{totalCost}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Your Balance</span>
              <span className={!hasEnoughCredits ? "text-red-500" : ""}>{userCredits.toLocaleString()} credits</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">After Export</span>
              <span className={`font-semibold ${!hasEnoughCredits ? "text-red-500" : "text-accent-foreground"}`}>
                {hasEnoughCredits ? (userCredits - totalCost).toLocaleString() : "Insufficient"} credits
              </span>
            </div>
          </div>

          {!hasEnoughCredits && (
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
              onClick={() => {
                handleClose()
                router.push("/credits")
              }}
            >
              <Coins className="h-4 w-4 mr-2" />
              Buy More Credits
            </Button>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isExporting}
            className="border-border text-foreground hover:bg-accent bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || !hasEnoughCredits}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isExporting ? "Exporting..." : "Confirm Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Generate mock CSV data
function generateCSV(niche: Niche, count: number): string {
  const headers = ["First Name", "Last Name", "Email", "Company", "Title", "Phone", "LinkedIn", "Country"]
  const firstNames = ["Ahmed", "Sara", "Mohammed", "Fatima", "Ali", "Aisha", "Omar", "Layla", "Hassan", "Noor"]
  const lastNames = ["Khan", "Ahmed", "Ali", "Hassan", "Hussein", "Mohammad", "Ibrahim", "Yusuf", "Rahman", "Sheikh"]
  const companies = [
    "TechCorp",
    "GlobalTrade",
    "InnovateCo",
    "PrimeSolutions",
    "NextGen",
    "FutureWorks",
    "AlphaGroup",
    "BetaVentures",
  ]
  const domains = ["gmail.com", "outlook.com", "yahoo.com", "company.com", "business.com"]

  const rows = [headers.join(",")]

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const company = companies[Math.floor(Math.random() * companies.length)]
    const domain = domains[Math.floor(Math.random() * domains.length)]
    const title = niche.roles[Math.floor(Math.random() * niche.roles.length)]

    const row = [
      firstName,
      lastName,
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      company,
      title,
      `+971-${Math.floor(Math.random() * 900000000 + 100000000)}`,
      `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
      niche.region,
    ]
    rows.push(row.join(","))
  }

  return rows.join("\n")
}
