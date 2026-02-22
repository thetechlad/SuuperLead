"use server"

import { getNicheById, getUser } from "@/lib/data"
import type { ExportResponse } from "@/lib/types"

export async function exportLeads(nicheId: string, leadCount: number): Promise<ExportResponse> {
  // Validate inputs
  if (!nicheId || !leadCount) {
    return { success: false, error: "Missing required fields" }
  }

  // Get niche details
  const niche = getNicheById(nicheId)
  if (!niche) {
    return { success: false, error: "Niche not found" }
  }

  // Validate lead count
  if (leadCount < 100 || leadCount > niche.availableLeads) {
    return { success: false, error: `Lead count must be between 100 and ${niche.availableLeads}` }
  }

  // Calculate cost
  const creditsCost = Math.ceil((leadCount / 100) * niche.creditCost)

  // Check user credits
  const user = getUser()
  if (user.credits < creditsCost) {
    return { success: false, error: "Insufficient credits. Please purchase more credits." }
  }

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In production, this would:
  // 1. Deduct credits from user account
  // 2. Generate CSV file with leads
  // 3. Store download record in database
  // 4. Return actual download URL

  const downloadId = `dl_${Date.now()}`

  return {
    success: true,
    downloadId,
    downloadUrl: `/api/downloads/${downloadId}/file`,
    creditsUsed: creditsCost,
    remainingCredits: user.credits - creditsCost,
  }
}
