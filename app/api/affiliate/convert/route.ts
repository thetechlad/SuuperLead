import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role for admin operations
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, referralCode } = body

    if (!userId || !referralCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get affiliate by code
    const { data: affiliate } = await supabaseAdmin
      .from("affiliates")
      .select("id")
      .eq("affiliate_code", referralCode.toUpperCase())
      .eq("status", "approved")
      .single()

    if (!affiliate) {
      return NextResponse.json({ error: "Invalid affiliate code" }, { status: 404 })
    }

    // Check for existing pending referral or create new one
    const { data: existingReferral } = await supabaseAdmin
      .from("referrals")
      .select("id")
      .eq("affiliate_id", affiliate.id)
      .is("referred_user_id", null)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (existingReferral) {
      // Update existing referral
      await supabaseAdmin
        .from("referrals")
        .update({
          referred_user_id: userId,
          status: "converted",
          converted_at: new Date().toISOString(),
        })
        .eq("id", existingReferral.id)
    } else {
      // Create new referral
      await supabaseAdmin.from("referrals").insert({
        affiliate_id: affiliate.id,
        referred_user_id: userId,
        status: "converted",
        converted_at: new Date().toISOString(),
      })
    }

    // Update affiliate conversion count
    await supabaseAdmin.rpc("increment_affiliate_conversions", { p_affiliate_id: affiliate.id }).catch(() => {
      // If RPC doesn't exist, do manual update
      return supabaseAdmin
        .from("affiliates")
        .update({
          total_conversions: supabaseAdmin.rpc("increment", { x: 1 }),
          updated_at: new Date().toISOString(),
        })
        .eq("id", affiliate.id)
    })

    // Update user profile with referrer
    await supabaseAdmin
      .from("profiles")
      .update({
        referred_by: affiliate.id,
      })
      .eq("id", userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to convert referral:", error)
    return NextResponse.json({ error: "Failed to convert referral" }, { status: 500 })
  }
}
