import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  getAffiliateByUserId,
  createAffiliateApplication,
  getAffiliateReferrals,
  getAffiliateCommissions,
  getAffiliatePayouts,
  requestPayout,
  updateAffiliatePaymentInfo,
} from "@/lib/db/affiliate-queries"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const affiliate = await getAffiliateByUserId(user.id)

    if (!affiliate) {
      return NextResponse.json({ affiliate: null })
    }

    const [referrals, commissions, payouts] = await Promise.all([
      getAffiliateReferrals(affiliate.id),
      getAffiliateCommissions(affiliate.id),
      getAffiliatePayouts(affiliate.id),
    ])

    return NextResponse.json({
      affiliate,
      referrals,
      commissions,
      payouts,
    })
  } catch (error) {
    console.error("Failed to fetch affiliate data:", error)
    return NextResponse.json({ error: "Failed to fetch affiliate data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, paymentEmail, paymentMethod, amount } = body

    switch (action) {
      case "apply": {
        const existing = await getAffiliateByUserId(user.id)
        if (existing) {
          return NextResponse.json({ error: "You already have an affiliate account" }, { status: 400 })
        }

        const affiliate = await createAffiliateApplication(user.id, paymentEmail, paymentMethod)
        return NextResponse.json({ affiliate })
      }

      case "update_payment": {
        const affiliate = await getAffiliateByUserId(user.id)
        if (!affiliate) {
          return NextResponse.json({ error: "Affiliate account not found" }, { status: 404 })
        }

        const updated = await updateAffiliatePaymentInfo(affiliate.id, paymentEmail, paymentMethod)
        return NextResponse.json({ affiliate: updated })
      }

      case "request_payout": {
        const affiliate = await getAffiliateByUserId(user.id)
        if (!affiliate) {
          return NextResponse.json({ error: "Affiliate account not found" }, { status: 404 })
        }

        if (affiliate.status !== "approved") {
          return NextResponse.json({ error: "Affiliate account not approved" }, { status: 400 })
        }

        if (amount < 50) {
          return NextResponse.json({ error: "Minimum payout is $50" }, { status: 400 })
        }

        if (amount > affiliate.pending_earnings) {
          return NextResponse.json({ error: "Amount exceeds available balance" }, { status: 400 })
        }

        const payout = await requestPayout(
          affiliate.id,
          amount,
          affiliate.payment_email || "",
          affiliate.payment_method,
        )
        return NextResponse.json({ payout })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Affiliate API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
