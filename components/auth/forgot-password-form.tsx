"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, Mail, CheckCircle } from "lucide-react"

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
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
            <h2 className="text-xl font-semibold text-foreground">Check your email</h2>
            <p className="text-muted-foreground text-sm">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>
            </p>
          </div>
          <div className="pt-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button variant="outline" onClick={() => setSuccess(false)} className="w-full">
              Try another email
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="space-y-1">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl text-card-foreground">Forgot your password?</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
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
            <Label htmlFor="email" className="text-foreground">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Remember your password? </span>
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
