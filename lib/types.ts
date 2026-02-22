// Core types for LeadDrop application

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  credits: number
  createdAt: Date
  updatedAt: Date
}

export interface Niche {
  id: string
  name: string
  country: string
  region: string
  roles: string[]
  availableLeads: number
  creditCost: number
  updatedAt: string
  description?: string
}

export interface Subscription {
  id: string
  userId: string
  nicheId: string
  niche: Niche
  frequency: "weekly" | "biweekly" | "monthly"
  leadsPerDelivery: number
  nextDelivery: string
  status: "active" | "paused" | "cancelled"
  createdAt: Date
  pastDeliveries: Delivery[]
}

export interface Delivery {
  id: string
  subscriptionId: string
  date: string
  leadCount: number
  downloadUrl?: string
}

export interface Download {
  id: string
  userId: string
  nicheId: string
  niche: Niche
  date: string
  leadCount: number
  creditsCost: number
  status: "processing" | "ready" | "expired"
  downloadUrl?: string
  expiresAt?: Date
}

export interface ExportRequest {
  nicheId: string
  leadCount: number
}

export interface ExportResponse {
  success: boolean
  downloadId?: string
  downloadUrl?: string
  creditsUsed?: number
  remainingCredits?: number
  error?: string
}

export interface CreditTransaction {
  id: string
  userId: string
  amount: number
  type: "purchase" | "export" | "subscription" | "refund"
  description: string
  createdAt: Date
}

export interface Affiliate {
  id: string
  user_id: string
  affiliate_code: string
  commission_rate: number
  status: "pending" | "approved" | "rejected" | "suspended"
  total_earnings: number
  pending_earnings: number
  paid_earnings: number
  total_referrals: number
  total_conversions: number
  payment_email?: string
  payment_method: string
  created_at: string
  updated_at: string
}

export interface Referral {
  id: string
  affiliate_id: string
  referred_user_id?: string
  status: "pending" | "converted" | "expired"
  ip_address?: string
  landing_page?: string
  converted_at?: string
  created_at: string
  referred_user?: {
    email: string
    full_name: string
  }
}

export interface AffiliateCommission {
  id: string
  affiliate_id: string
  referral_id?: string
  transaction_id?: string
  amount: number
  commission_rate: number
  commission_amount: number
  status: "pending" | "approved" | "paid" | "rejected"
  created_at: string
}

export interface AffiliatePayout {
  id: string
  affiliate_id: string
  amount: number
  payment_method: string
  payment_email: string
  status: "pending" | "processing" | "completed" | "failed"
  transaction_reference?: string
  notes?: string
  processed_at?: string
  created_at: string
}
