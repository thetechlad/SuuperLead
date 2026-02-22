import { NextResponse } from "next/server"
import { getUserDownloads } from "@/lib/data"

export async function GET() {
  const downloads = getUserDownloads()
  return NextResponse.json({ downloads, total: downloads.length })
}
