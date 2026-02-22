"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, DollarSign, TrendingUp, Copy, Check, Link2, Wallet, Clock, AlertCircle } from "lucide-react"
import type { Affiliate, Referral, AffiliateCommission, AffiliatePayout } from "@/lib/types"

export default function AffiliatePage() {
  const { user } = useUser()
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([])
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isRequestingPayout, setIsRequestingPayout] = useState(false)
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState("")
  const [applicationEmail, setApplicationEmail] = useState("")
  const [applicationMethod, setApplicationMethod] = useState("paypal")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchAffiliateData()
      setApplicationEmail(user.email || "")
    }
  }, [user])

  const fetchAffiliateData = async () => {
    try {
      const res = await fetch("/api/affiliate")
      const data = await res.json()

      if (data.affiliate) {
        setAffiliate(data.affiliate)
        setReferrals(data.referrals || [])
        setCommissions(data.commissions || [])
        setPayouts(data.payouts || [])
      }
    } catch (err) {
      console.error("Failed to fetch affiliate data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = async () => {
    if (!applicationEmail) {
      setError("Please enter a payment email")
      return
    }

    setIsApplying(true)
    setError(null)

    try {
      const res = await fetch("/api/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply",
          paymentEmail: applicationEmail,
          paymentMethod: applicationMethod,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setAffiliate(data.affiliate)
        setSuccess("Application submitted! We'll review it within 24-48 hours.")
      }
    } catch (err) {
      setError("Failed to submit application")
    } finally {
      setIsApplying(false)
    }
  }

  const handleRequestPayout = async () => {
    const amount = Number.parseFloat(payoutAmount)
    if (!amount || amount < 50) {
      setError("Minimum payout amount is $50")
      return
    }

    if (affiliate && amount > affiliate.pending_earnings) {
      setError("Amount exceeds available balance")
      return
    }

    setIsRequestingPayout(true)
    setError(null)

    try {
      const res = await fetch("/api/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_payout",
          amount,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setPayoutDialogOpen(false)
        setPayoutAmount("")
        fetchAffiliateData()
        setSuccess("Payout request submitted!")
      }
    } catch (err) {
      setError("Failed to request payout")
    } finally {
      setIsRequestingPayout(false)
    }
  }

  const copyAffiliateLink = () => {
    if (affiliate) {
      const link = `${window.location.origin}?ref=${affiliate.affiliate_code}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      approved: "bg-green-500/10 text-green-500 border-green-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
      suspended: "bg-red-500/10 text-red-500 border-red-500/20",
      converted: "bg-green-500/10 text-green-500 border-green-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      paid: "bg-green-500/10 text-green-500 border-green-500/20",
    }
    return styles[status] || "bg-muted text-muted-foreground"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  // Not an affiliate yet - show application form
  if (!affiliate) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Affiliate Program</h1>
          <p className="text-muted-foreground mt-1">Earn 20% commission on every referral</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Join Our Affiliate Program</CardTitle>
              <CardDescription>Earn passive income by referring customers to LeadDrop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">20% Commission</p>
                    <p className="text-sm text-muted-foreground">Earn 20% on every purchase made by your referrals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">90-Day Cookie</p>
                    <p className="text-sm text-muted-foreground">
                      Get credit for referrals up to 90 days after the first click
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Monthly Payouts</p>
                    <p className="text-sm text-muted-foreground">Get paid via PayPal or bank transfer (min. $50)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Apply Now</CardTitle>
              <CardDescription>Fill in your details to join the affiliate program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <Check className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Payment Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={applicationEmail}
                  onChange={(e) => setApplicationEmail(e.target.value)}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select value={applicationMethod} onValueChange={setApplicationMethod}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="wise">Wise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleApply}
                disabled={isApplying}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isApplying ? "Submitting..." : "Apply to Become an Affiliate"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Pending approval
  if (affiliate.status === "pending") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Affiliate Program</h1>
          <p className="text-muted-foreground mt-1">Your application is under review</p>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Application Pending</h2>
                <p className="text-muted-foreground mt-2">
                  We're reviewing your application. This usually takes 24-48 hours. We'll notify you by email once it's
                  approved.
                </p>
              </div>
              <Badge className={getStatusBadge("pending")}>Pending Review</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Approved affiliate dashboard
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Affiliate Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your referrals and earnings</p>
        </div>
        <Badge className={getStatusBadge(affiliate.status)}>
          {affiliate.status.charAt(0).toUpperCase() + affiliate.status.slice(1)}
        </Badge>
      </div>

      {success && (
        <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
          <Check className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Affiliate Link Card */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Your Affiliate Link</p>
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                <code className="text-sm text-foreground bg-muted px-2 py-1 rounded">
                  {typeof window !== "undefined" ? window.location.origin : ""}?ref={affiliate.affiliate_code}
                </code>
              </div>
            </div>
            <Button onClick={copyAffiliateLink} variant="outline" className="gap-2 bg-transparent">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold text-foreground">{affiliate.total_referrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold text-foreground">{affiliate.total_conversions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Earnings</p>
                <p className="text-2xl font-bold text-foreground">${affiliate.pending_earnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold text-foreground">${affiliate.total_earnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Payout Button */}
      {affiliate.pending_earnings >= 50 && (
        <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Wallet className="h-4 w-4 mr-2" />
              Request Payout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Request Payout</DialogTitle>
              <DialogDescription>
                Minimum payout is $50. Available balance: ${affiliate.pending_earnings.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="50"
                  max={affiliate.pending_earnings}
                  placeholder="50.00"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Payment will be sent to: <strong>{affiliate.payment_email}</strong> via{" "}
                <strong>{affiliate.payment_method}</strong>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPayoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRequestPayout}
                disabled={isRequestingPayout}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isRequestingPayout ? "Submitting..." : "Request Payout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Tabs for Referrals, Commissions, Payouts */}
      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Your Referrals</CardTitle>
              <CardDescription>Users who signed up using your affiliate link</CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No referrals yet. Share your link to start earning!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">User</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((referral) => (
                      <TableRow key={referral.id} className="border-border">
                        <TableCell className="text-foreground">
                          {referral.referred_user?.email || "Pending signup"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(referral.status)}>{referral.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(referral.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Commission History</CardTitle>
              <CardDescription>Earnings from your referrals' purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {commissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No commissions yet. You'll earn when your referrals make purchases.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-muted-foreground">Commission</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.id} className="border-border">
                        <TableCell className="text-foreground">${commission.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-green-500 font-medium">
                          +${commission.commission_amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(commission.status)}>{commission.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(commission.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">Payout History</CardTitle>
              <CardDescription>Your withdrawal requests and status</CardDescription>
            </CardHeader>
            <CardContent>
              {payouts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No payouts yet. Request a payout when you reach $50.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-muted-foreground">Method</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id} className="border-border">
                        <TableCell className="text-foreground font-medium">${payout.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-muted-foreground">{payout.payment_method}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(payout.status)}>{payout.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(payout.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
