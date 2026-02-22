"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, Lock, CheckCircle } from "lucide-react"

export function ResetPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Check if we have a valid session from the reset link
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User clicked the reset link - they can now set a new password
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    }
    setIsLoading(false)
  }

  if (success) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Password reset successful</h2>
            <p className="text-muted-foreground text-sm">Your password has been updated. Redirecting you to login...</p>
          </div>
          <Link href="/login">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Go to login</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl text-card-foreground">Set new password</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your new password below. Make sure it's at least 8 characters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              New Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-foreground">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
