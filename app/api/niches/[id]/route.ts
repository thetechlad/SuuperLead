import { NextResponse } from "next/server"
import { getNicheById } from "@/lib/data"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const niche = getNicheById(id)

  if (!niche) {
    return NextResponse.json({ error: "Niche not found" }, { status: 404 })
  }

  return NextResponse.json({ niche })
}
