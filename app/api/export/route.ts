import { NextResponse } from "next/server"
import { getNicheById, getUser } from "@/lib/data"
import type { ExportResponse } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nicheId, leadCount } = body

    // Validate inputs
    if (!nicheId || !leadCount) {
      return NextResponse.json({ success: false, error: "Missing required fields" } as ExportResponse, { status: 400 })
    }

    // Get niche details
    const niche = getNicheById(nicheId)
    if (!niche) {
      return NextResponse.json({ success: false, error: "Niche not found" } as ExportResponse, { status: 404 })
    }

    // Validate lead count
    if (leadCount < 100 || leadCount > niche.availableLeads) {
      return NextResponse.json(
        { success: false, error: `Lead count must be between 100 and ${niche.availableLeads}` } as ExportResponse,
        { status: 400 },
      )
    }

    // Calculate cost
    const creditsCost = Math.ceil((leadCount / 100) * niche.creditCost)

    // Check user credits
    const user = getUser()
    if (user.credits < creditsCost) {
      return NextResponse.json(
        { success: false, error: "Insufficient credits. Please purchase more credits." } as ExportResponse,
        { status: 400 },
      )
    }

    // In production, this would:
    // 1. Deduct credits from user account
    // 2. Generate CSV file with leads
    // 3. Store download record in database
    // 4. Return actual download URL

    const downloadId = `dl_${Date.now()}`
    const response: ExportResponse = {
      success: true,
      downloadId,
      downloadUrl: `/api/downloads/${downloadId}/file`,
      creditsUsed: creditsCost,
      remainingCredits: user.credits - creditsCost,
    }

    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ success: false, error: "Failed to process export request" } as ExportResponse, {
      status: 500,
    })
  }
}
