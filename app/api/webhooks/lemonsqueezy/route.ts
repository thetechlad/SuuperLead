import crypto from "node:crypto"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase admin client for webhook handling
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// LemonSqueezy webhook handler
export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

  if (!secret) {
    console.error("[v0] LEMONSQUEEZY_WEBHOOK_SECRET not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get("X-Signature") ?? ""

  // Verify webhook signature
  const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")

  if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))) {
    console.error("[v0] Invalid webhook signature")
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  try {
    const payload = JSON.parse(rawBody)
    const eventName = payload.meta?.event_name
    const customData = payload.meta?.custom_data || {}

    console.log(`[v0] LemonSqueezy webhook received: ${eventName}`)

    switch (eventName) {
      case "order_created": {
        // One-time credit purchase completed
        const userId = customData.user_id
        const credits = Number.parseInt(customData.credits || "0", 10)
        const orderId = payload.data?.id
        const orderStatus = payload.data?.attributes?.status
        const totalAmount = payload.data?.attributes?.total

        if (orderStatus === "paid" && userId && credits > 0) {
          // Get current user credits
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("credits, referred_by")
            .eq("id", userId)
            .single()

          if (profile) {
            // Add credits to user
            await supabaseAdmin
              .from("profiles")
              .update({
                credits: profile.credits + credits,
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId)

            // Create transaction record
            const { data: transaction } = await supabaseAdmin
              .from("transactions")
              .insert({
                user_id: userId,
                type: "credit_purchase",
                amount: totalAmount / 100,
                credits: credits,
                description: `Purchased ${credits} credits`,
                lemonsqueezy_order_id: String(orderId),
              })
              .select()
              .single()

            if (profile.referred_by && transaction) {
              await processAffiliateCommission(profile.referred_by, transaction.id, totalAmount / 100)
            }

            console.log(`[v0] Added ${credits} credits to user ${userId} (Order: ${orderId})`)
          }
        }
        break
      }

      case "subscription_created": {
        const userId = customData.user_id
        const subscriptionId = payload.data?.id
        const planName = customData.plan_name || "Pro Plan"
        const creditsPerMonth = Number.parseInt(customData.credits_per_month || "1000", 10)
        const pricePerMonth = payload.data?.attributes?.first_subscription_item?.price / 100 || 0
        const status = payload.data?.attributes?.status
        const renewsAt = payload.data?.attributes?.renews_at

        if (userId) {
          await supabaseAdmin.from("subscriptions").insert({
            user_id: userId,
            plan_name: planName,
            status: status === "active" ? "active" : "pending",
            credits_per_month: creditsPerMonth,
            price_per_month: pricePerMonth,
            current_period_start: new Date().toISOString(),
            current_period_end: renewsAt,
            lemonsqueezy_subscription_id: String(subscriptionId),
          })

          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("credits, referred_by")
            .eq("id", userId)
            .single()

          if (profile) {
            await supabaseAdmin
              .from("profiles")
              .update({
                credits: profile.credits + creditsPerMonth,
                updated_at: new Date().toISOString(),
              })
              .eq("id", userId)

            const { data: transaction } = await supabaseAdmin
              .from("transactions")
              .insert({
                user_id: userId,
                type: "subscription",
                amount: pricePerMonth,
                credits: creditsPerMonth,
                description: `${planName} subscription started`,
              })
              .select()
              .single()

            if (profile.referred_by && transaction) {
              await processAffiliateCommission(profile.referred_by, transaction.id, pricePerMonth)
            }
          }

          console.log(`[v0] Subscription created for user ${userId}: ${subscriptionId}`)
        }
        break
      }

      case "subscription_updated": {
        const subscriptionId = payload.data?.id
        const status = payload.data?.attributes?.status
        const renewsAt = payload.data?.attributes?.renews_at

        const { data: subscription } = await supabaseAdmin
          .from("subscriptions")
          .select("*, user_id, credits_per_month, price_per_month")
          .eq("lemonsqueezy_subscription_id", String(subscriptionId))
          .single()

        if (subscription) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: status === "active" ? "active" : status,
              current_period_end: renewsAt,
              updated_at: new Date().toISOString(),
            })
            .eq("id", subscription.id)

          if (status === "active") {
            const { data: profile } = await supabaseAdmin
              .from("profiles")
              .select("credits, referred_by")
              .eq("id", subscription.user_id)
              .single()

            if (profile) {
              await supabaseAdmin
                .from("profiles")
                .update({
                  credits: profile.credits + subscription.credits_per_month,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", subscription.user_id)

              const { data: transaction } = await supabaseAdmin
                .from("transactions")
                .insert({
                  user_id: subscription.user_id,
                  type: "subscription",
                  amount: subscription.price_per_month,
                  credits: subscription.credits_per_month,
                  description: "Monthly subscription credits",
                })
                .select()
                .single()

              if (profile.referred_by && transaction) {
                await processAffiliateCommission(profile.referred_by, transaction.id, subscription.price_per_month)
              }
            }
          }

          console.log(`[v0] Subscription updated: ${subscriptionId}`)
        }
        break
      }

      case "subscription_cancelled": {
        const subscriptionId = payload.data?.id
        const endsAt = payload.data?.attributes?.ends_at

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "cancelled",
            current_period_end: endsAt,
            updated_at: new Date().toISOString(),
          })
          .eq("lemonsqueezy_subscription_id", String(subscriptionId))

        console.log(`[v0] Subscription cancelled: ${subscriptionId}`)
        break
      }

      default:
        console.log(`[v0] Unhandled webhook event: ${eventName}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function processAffiliateCommission(affiliateId: string, transactionId: string, amount: number) {
  try {
    // Get affiliate and their commission rate
    const { data: affiliate } = await supabaseAdmin
      .from("affiliates")
      .select("id, commission_rate, pending_earnings, total_earnings")
      .eq("id", affiliateId)
      .eq("status", "approved")
      .single()

    if (!affiliate) return

    // Calculate commission (default 20%)
    const commissionRate = affiliate.commission_rate || 20
    const commissionAmount = (amount * commissionRate) / 100

    // Get referral for this affiliate
    const { data: referral } = await supabaseAdmin
      .from("referrals")
      .select("id")
      .eq("affiliate_id", affiliateId)
      .eq("status", "converted")
      .order("converted_at", { ascending: false })
      .limit(1)
      .single()

    // Create commission record
    await supabaseAdmin.from("affiliate_commissions").insert({
      affiliate_id: affiliateId,
      referral_id: referral?.id,
      transaction_id: transactionId,
      amount: amount,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      status: "pending",
    })

    // Update affiliate earnings
    await supabaseAdmin
      .from("affiliates")
      .update({
        pending_earnings: affiliate.pending_earnings + commissionAmount,
        total_earnings: affiliate.total_earnings + commissionAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", affiliateId)

    console.log(`[v0] Affiliate commission created: $${commissionAmount} for affiliate ${affiliateId}`)
  } catch (error) {
    console.error("[v0] Failed to process affiliate commission:", error)
  }
}
