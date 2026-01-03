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
import { Coins, CheckCircle2, Download } from "lucide-react"

interface ExportModalProps {
  niche: {
    id: number
    name: string
    country: string
    availableLeads: number
    creditCost: number
  } | null
  open: boolean
  onClose: () => void
}

export function ExportModal({ niche, open, onClose }: ExportModalProps) {
  const router = useRouter()
  const [leadCount, setLeadCount] = useState(500)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState("")

  if (!niche) return null

  const totalCost = Math.ceil((leadCount / 100) * niche.creditCost)

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export
    setTimeout(() => {
      setIsExporting(false)
      setExportSuccess(true)
      setDownloadUrl(`/api/downloads/export-${Date.now()}.csv`)
    }, 2000)
  }

  const handleClose = () => {
    setExportSuccess(false)
    setLeadCount(500)
    setDownloadUrl("")
    onClose()
  }

  if (exportSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <DialogTitle className="text-center">Export Complete!</DialogTitle>
            <DialogDescription className="text-center">
              Your {leadCount} leads have been exported successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-accent rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-accent-foreground">{niche.name}</p>
              <p className="text-xs text-muted-foreground">
                {leadCount} leads • {niche.country}
              </p>
            </div>
            <Button className="w-full" onClick={() => window.open(downloadUrl, "_blank")}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/downloads")}>
              View All Downloads
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Leads</DialogTitle>
          <DialogDescription>Configure your export from {niche.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="lead-count">Number of Leads</Label>
            <Input
              id="lead-count"
              type="number"
              min={100}
              max={niche.availableLeads}
              step={100}
              value={leadCount}
              onChange={(e) => setLeadCount(Number(e.target.value))}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">Maximum: {niche.availableLeads.toLocaleString()} leads</p>
          </div>

          <div className="bg-accent rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-accent-foreground">Credit Cost</span>
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4 text-accent-foreground" />
                <span className="font-semibold text-accent-foreground">{totalCost}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Your Balance</span>
              <span>5,000 credits</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">After Export</span>
              <span className="font-semibold text-accent-foreground">
                {(5000 - totalCost).toLocaleString()} credits
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || totalCost > 5000}>
            {isExporting ? "Exporting..." : "Confirm Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
