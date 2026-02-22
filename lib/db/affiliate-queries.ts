import { createClient } from "@/lib/supabase/server"

// Get affiliate by user ID
export async function getAffiliateByUserId(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("affiliates").select("*").eq("user_id", userId).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

// Get affiliate by code
export async function getAffiliateByCode(code: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("affiliates")
    .select("*")
    .eq("affiliate_code", code.toUpperCase())
    .eq("status", "approved")
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

// Create affiliate application
export async function createAffiliateApplication(userId: string, paymentEmail: string, paymentMethod = "paypal") {
  const supabase = await createClient()

  // Generate unique affiliate code
  const code = Math.random().toString(36).substring(2, 10).toUpperCase()

  const { data, error } = await supabase
    .from("affiliates")
    .insert({
      user_id: userId,
      affiliate_code: code,
      payment_email: paymentEmail,
      payment_method: paymentMethod,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Update affiliate payment info
export async function updateAffiliatePaymentInfo(affiliateId: string, paymentEmail: string, paymentMethod: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("affiliates")
    .update({
      payment_email: paymentEmail,
      payment_method: paymentMethod,
      updated_at: new Date().toISOString(),
    })
    .eq("id", affiliateId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get referrals for affiliate
export async function getAffiliateReferrals(affiliateId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("referrals")
    .select(`
      *,
      referred_user:profiles!referrals_referred_user_id_fkey(email, full_name)
    `)
    .eq("affiliate_id", affiliateId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Get commissions for affiliate
export async function getAffiliateCommissions(affiliateId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("affiliate_commissions")
    .select("*")
    .eq("affiliate_id", affiliateId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Get payouts for affiliate
export async function getAffiliatePayouts(affiliateId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("affiliate_payouts")
    .select("*")
    .eq("affiliate_id", affiliateId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Request payout
export async function requestPayout(affiliateId: string, amount: number, paymentEmail: string, paymentMethod: string) {
  const supabase = await createClient()

  // Create payout request
  const { data: payout, error: payoutError } = await supabase
    .from("affiliate_payouts")
    .insert({
      affiliate_id: affiliateId,
      amount,
      payment_email: paymentEmail,
      payment_method: paymentMethod,
      status: "pending",
    })
    .select()
    .single()

  if (payoutError) throw payoutError

  // Update affiliate pending earnings
  const { error: updateError } = await supabase.rpc("deduct_affiliate_pending_earnings", {
    p_affiliate_id: affiliateId,
    p_amount: amount,
  })

  // If RPC doesn't exist, do it manually
  if (updateError) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("pending_earnings")
      .eq("id", affiliateId)
      .single()

    if (affiliate) {
      await supabase
        .from("affiliates")
        .update({
          pending_earnings: Math.max(0, affiliate.pending_earnings - amount),
          updated_at: new Date().toISOString(),
        })
        .eq("id", affiliateId)
    }
  }

  return payout
}

// Track referral click
export async function trackReferralClick(
  affiliateCode: string,
  ipAddress?: string,
  userAgent?: string,
  landingPage?: string,
) {
  const supabase = await createClient()

  // Get affiliate
  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("id")
    .eq("affiliate_code", affiliateCode.toUpperCase())
    .eq("status", "approved")
    .single()

  if (!affiliate) return null

  // Create referral record
  const { data, error } = await supabase
    .from("referrals")
    .insert({
      affiliate_id: affiliate.id,
      ip_address: ipAddress,
      user_agent: userAgent,
      landing_page: landingPage,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error

  // Update affiliate referral count
  await supabase.rpc("increment_affiliate_referrals", { p_affiliate_id: affiliate.id })

  return data
}

// Convert referral (when user signs up)
export async function convertReferral(referralId: string, userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("referrals")
    .update({
      referred_user_id: userId,
      status: "converted",
      converted_at: new Date().toISOString(),
    })
    .eq("id", referralId)
    .select("affiliate_id")
    .single()

  if (error) throw error

  // Update affiliate conversion count
  if (data) {
    await supabase
      .from("affiliates")
      .update({
        total_conversions: supabase.rpc("increment", { x: 1 }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.affiliate_id)
  }

  return data
}

// Get affiliate stats
export async function getAffiliateStats(affiliateId: string) {
  const supabase = await createClient()

  // Get basic stats from affiliate record
  const { data: affiliate, error } = await supabase.from("affiliates").select("*").eq("id", affiliateId).single()

  if (error) throw error

  // Get this month's stats
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count: monthlyReferrals } = await supabase
    .from("referrals")
    .select("*", { count: "exact", head: true })
    .eq("affiliate_id", affiliateId)
    .gte("created_at", startOfMonth.toISOString())

  const { data: monthlyCommissions } = await supabase
    .from("affiliate_commissions")
    .select("commission_amount")
    .eq("affiliate_id", affiliateId)
    .gte("created_at", startOfMonth.toISOString())

  const monthlyEarnings = monthlyCommissions?.reduce((sum, c) => sum + Number(c.commission_amount), 0) || 0

  return {
    ...affiliate,
    monthlyReferrals: monthlyReferrals || 0,
    monthlyEarnings,
  }
}

// Admin: Get all affiliates
export async function getAllAffiliates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("affiliates")
    .select(`
      *,
      profile:profiles(email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Admin: Update affiliate status
export async function updateAffiliateStatus(affiliateId: string, status: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("affiliates")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", affiliateId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Admin: Get all payout requests
export async function getAllPayoutRequests() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("affiliate_payouts")
    .select(`
      *,
      affiliate:affiliates(
        affiliate_code,
        profile:profiles(email, full_name)
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Admin: Process payout
export async function processPayout(payoutId: string, status: string, transactionReference?: string, notes?: string) {
  const supabase = await createClient()

  const { data: payout, error } = await supabase
    .from("affiliate_payouts")
    .update({
      status,
      transaction_reference: transactionReference,
      notes,
      processed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", payoutId)
    .select("*, affiliate_id, amount")
    .single()

  if (error) throw error

  // If completed, update affiliate paid earnings
  if (status === "completed" && payout) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("paid_earnings")
      .eq("id", payout.affiliate_id)
      .single()

    if (affiliate) {
      await supabase
        .from("affiliates")
        .update({
          paid_earnings: affiliate.paid_earnings + payout.amount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payout.affiliate_id)
    }
  }

  return payout
}
