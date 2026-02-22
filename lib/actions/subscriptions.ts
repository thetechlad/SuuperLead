"use server"

import { getUserSubscriptions, getNicheById } from "@/lib/data"
import type { Subscription } from "@/lib/types"

export async function getSubscriptions(): Promise<Subscription[]> {
  return getUserSubscriptions()
}

export async function createSubscription(
  nicheId: string,
  frequency: "weekly" | "biweekly" | "monthly",
  leadsPerDelivery: number,
): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
  const niche = getNicheById(nicheId)
  if (!niche) {
    return { success: false, error: "Niche not found" }
  }

  // In production, this would create a subscription in the database
  const subscription: Subscription = {
    id: `sub_${Date.now()}`,
    userId: "user_1",
    nicheId,
    niche,
    frequency,
    leadsPerDelivery,
    nextDelivery: getNextDeliveryDate(frequency),
    status: "active",
    createdAt: new Date(),
    pastDeliveries: [],
  }

  return { success: true, subscription }
}

export async function cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  // In production, this would update the subscription status in the database
  return { success: true }
}

function getNextDeliveryDate(frequency: "weekly" | "biweekly" | "monthly"): string {
  const now = new Date()
  const days = frequency === "weekly" ? 7 : frequency === "biweekly" ? 14 : 30
  const nextDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  return nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
