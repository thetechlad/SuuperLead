"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User, Bell, CreditCard, Shield, Trash2, Upload, Check, AlertCircle, Loader2 } from "lucide-react"
import { useUser } from "@/lib/hooks/use-user"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const { profile, loading, logout, refreshProfile } = useUser()
  const router = useRouter()

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [exportAlerts, setExportAlerts] = useState(true)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "")
      setEmail(profile.email || "")
    }
  }, [profile])

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    const supabase = createClient()

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    if (error) {
      setSaveError(error.message)
    } else {
      setSaveSuccess(true)
      await refreshProfile()
      setTimeout(() => setSaveSuccess(false), 3000)
    }

    setIsSaving(false)
  }

  const handleUpdatePassword = async () => {
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordError(error.message)
    } else {
      setPasswordSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPasswordSuccess(false), 3000)
    }
  }

  const handleDeleteAccount = async () => {
    await logout()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">
          Account
        </Badge>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Profile</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {saveSuccess && (
            <Alert className="bg-green-500/10 border-green-500/20">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">Profile updated successfully!</AlertDescription>
            </Alert>
          )}

          {saveError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border text-foreground hover:bg-accent bg-transparent"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-input border-border text-foreground placeholder:text-muted-foreground opacity-50"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>

          <Button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Notifications</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Configure how you want to receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Get a weekly summary of your activity</p>
            </div>
            <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Export Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when exports are ready</p>
            </div>
            <Switch checked={exportAlerts} onCheckedChange={setExportAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* Billing Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Billing</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Manage your subscription and payment methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-accent rounded-lg border border-border">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-foreground">Credit Balance</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {profile?.credits?.toLocaleString() || 0} credits available
              </p>
            </div>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-accent bg-transparent"
              onClick={() => router.push("/credits")}
            >
              Buy Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Security</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {passwordError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}

          {passwordSuccess && (
            <Alert className="bg-green-500/10 border-green-500/20">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">Password updated successfully!</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-foreground">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <Button onClick={handleUpdatePassword} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Irreversible and destructive actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="text-popover-foreground">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone. All your data, including
              credits and download history, will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Yes, Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
