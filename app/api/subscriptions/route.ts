import { NextResponse } from "next/server"
import { getUserSubscriptions } from "@/lib/data"

export async function GET() {
  const subscriptions = getUserSubscriptions()
  return NextResponse.json({ subscriptions, total: subscriptions.length })
}
