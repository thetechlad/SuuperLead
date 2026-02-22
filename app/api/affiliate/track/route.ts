import { type NextRequest, NextResponse } from "next/server"
import { trackReferralClick, getAffiliateByCode } from "@/lib/db/affiliate-queries"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, landingPage } = body

    if (!code) {
      return NextResponse.json({ error: "Affiliate code required" }, { status: 400 })
    }

    // Check if affiliate exists and is approved
    const affiliate = await getAffiliateByCode(code)
    if (!affiliate) {
      return NextResponse.json({ error: "Invalid affiliate code" }, { status: 404 })
    }

    // Get client info
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || ""
    const userAgent = request.headers.get("user-agent") || ""

    // Track the click
    const referral = await trackReferralClick(code, ip, userAgent, landingPage)

    return NextResponse.json({
      success: true,
      referralId: referral?.id,
      affiliateId: affiliate.id,
    })
  } catch (error) {
    console.error("Failed to track referral:", error)
    return NextResponse.json({ error: "Failed to track referral" }, { status: 500 })
  }
}
