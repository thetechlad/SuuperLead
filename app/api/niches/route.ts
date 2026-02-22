import { NextResponse } from "next/server"
import { getNiches, searchNiches, getNichesByRegion } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const region = searchParams.get("region")

  let niches

  if (query) {
    niches = searchNiches(query)
  } else if (region) {
    niches = getNichesByRegion(region)
  } else {
    niches = getNiches()
  }

  return NextResponse.json({ niches, total: niches.length })
}
