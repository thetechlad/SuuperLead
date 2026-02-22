import { createClient } from "@/lib/supabase/server"

// Profile queries
export async function getProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: { full_name?: string; email?: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCredits(userId: string, credits: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .update({ credits, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Niche queries
export async function getNiches() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("niches")
    .select("*")
    .eq("status", "active")
    .order("lead_count", { ascending: false })

  if (error) throw error
  return data
}

export async function getNicheById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("niches").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function getLeadsByNiche(nicheId: string, limit = 100) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("leads").select("*").eq("niche_id", nicheId).limit(limit)

  if (error) throw error
  return data
}

// Download queries
export async function getDownloads(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("downloads")
    .select(`
      *,
      niche:niches(id, name, region, industry, roles)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createDownload(data: {
  user_id: string
  niche_id: string
  lead_count: number
  credits_used: number
  file_url?: string
  file_name?: string
}) {
  const supabase = await createClient()
  const { data: download, error } = await supabase.from("downloads").insert(data).select().single()

  if (error) throw error
  return download
}

// Subscription queries
export async function getSubscriptions(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createSubscription(data: {
  user_id: string
  plan_name: string
  credits_per_month: number
  price_per_month: number
  lemonsqueezy_subscription_id?: string
}) {
  const supabase = await createClient()
  const { data: subscription, error } = await supabase.from("subscriptions").insert(data).select().single()

  if (error) throw error
  return subscription
}

// Transaction queries
export async function getTransactions(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createTransaction(data: {
  user_id: string
  type: "credit_purchase" | "subscription" | "export" | "refund" | "bonus"
  amount?: number
  credits?: number
  description?: string
  lemonsqueezy_order_id?: string
}) {
  const supabase = await createClient()
  const { data: transaction, error } = await supabase.from("transactions").insert(data).select().single()

  if (error) throw error
  return transaction
}

// Admin queries
export async function getAllProfiles() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getAllNiches() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("niches").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getAllTransactions() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      profile:profiles(id, email, full_name)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createNiche(data: {
  name: string
  description?: string
  region: string
  industry: string
  roles?: string[]
  lead_count?: number
  price_per_lead?: number
}) {
  const supabase = await createClient()
  const { data: niche, error } = await supabase.from("niches").insert(data).select().single()

  if (error) throw error
  return niche
}

// Stats queries
export async function getDashboardStats(userId: string) {
  const supabase = await createClient()

  // Get profile
  const { data: profile } = await supabase.from("profiles").select("credits").eq("id", userId).single()

  // Get subscription count
  const { count: subscriptionCount } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active")

  // Get download count (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const { count: downloadCount } = await supabase
    .from("downloads")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", thirtyDaysAgo.toISOString())

  return {
    credits: profile?.credits || 0,
    activeSubscriptions: subscriptionCount || 0,
    totalDownloads: downloadCount || 0,
  }
}
