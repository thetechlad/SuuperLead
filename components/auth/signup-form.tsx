"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { getReferralCode, clearReferralCode } from "@/components/affiliate/referral-tracker"
import { AlertCircle, Check } from "lucide-react"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

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

    if (!acceptTerms) {
      setError("You must accept the terms and conditions")
      return
    }

    setIsLoading(true)

    const referralCode = getReferralCode()

    const supabase = createClient()
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        data: {
          full_name: name,
          referral_code: referralCode, // Pass referral code to metadata
        },
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      if (referralCode && data.user) {
        try {
          await fetch("/api/affiliate/convert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: data.user.id,
              referralCode,
            }),
          })
          clearReferralCode() // Clear the cookie after conversion
        } catch (err) {
          console.error("Failed to convert referral:", err)
        }
      }

      setSuccess(true)
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">LD</span>
          </div>
          <span className="text-xl font-semibold text-foreground">LeadDrop</span>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Check your email</h2>
              <p className="text-muted-foreground text-sm">
                We've sent a confirmation link to <strong className="text-foreground">{email}</strong>
              </p>
              <p className="text-muted-foreground text-sm">
                Click the link in the email to activate your account and get your 100 free credits.
              </p>
            </div>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">LD</span>
        </div>
        <span className="text-xl font-semibold text-foreground">LeadDrop</span>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create your account</h1>
        <p className="text-muted-foreground">Get 100 free credits when you sign up</p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl text-card-foreground">Get started with LeadDrop</CardTitle>
          <CardDescription className="text-muted-foreground">Fill in your details below</CardDescription>
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
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Work Email
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min. 8 characters)"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Bonus indicator */}
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">100 free credits included with signup</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-6">
          <Separator className="bg-border" />
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
