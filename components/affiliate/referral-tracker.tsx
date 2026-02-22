"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

const REFERRAL_COOKIE_NAME = "leaddrop_ref"
const REFERRAL_COOKIE_DAYS = 90

export function ReferralTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get("ref")

    if (ref) {
      // Store referral code in cookie
      const expires = new Date()
      expires.setDate(expires.getDate() + REFERRAL_COOKIE_DAYS)
      document.cookie = `${REFERRAL_COOKIE_NAME}=${ref};expires=${expires.toUTCString()};path=/`

      // Track the click
      fetch("/api/affiliate/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: ref,
          landingPage: window.location.pathname,
        }),
      }).catch(console.error)
    }
  }, [searchParams])

  return null
}

// Helper to get referral code from cookie
export function getReferralCode(): string | null {
  if (typeof document === "undefined") return null

  const match = document.cookie.match(new RegExp(`(^| )${REFERRAL_COOKIE_NAME}=([^;]+)`))
  return match ? match[2] : null
}

// Helper to clear referral cookie after conversion
export function clearReferralCode() {
  if (typeof document === "undefined") return
  document.cookie = `${REFERRAL_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}
