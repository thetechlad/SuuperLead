// LemonSqueezy utility functions
// Install: npm install @lemonsqueezy/lemonsqueezy.js

const API_URL = "https://api.lemonsqueezy.com/v1"

interface LemonSqueezyConfig {
  apiKey: string
  storeId: string
}

function getConfig(): LemonSqueezyConfig {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  const storeId = process.env.LEMONSQUEEZY_STORE_ID

  if (!apiKey || !storeId) {
    throw new Error("LemonSqueezy configuration missing. Set LEMONSQUEEZY_API_KEY and LEMONSQUEEZY_STORE_ID")
  }

  return { apiKey, storeId }
}

async function lemonSqueezyFetch(endpoint: string, options: RequestInit = {}) {
  const { apiKey } = getConfig()

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
      ...options.headers,
    },
  })

  return response.json()
}

// Get all products from your store
export async function getProducts() {
  const { storeId } = getConfig()
  return lemonSqueezyFetch(`/products?filter[store_id]=${storeId}`)
}

// Get all variants (pricing options) for a product
export async function getVariants(productId: string) {
  return lemonSqueezyFetch(`/variants?filter[product_id]=${productId}`)
}

// Get customer portal URL for managing subscriptions
export async function getCustomerPortalUrl(customerId: string) {
  const data = await lemonSqueezyFetch(`/customers/${customerId}`)
  return data.data?.attributes?.urls?.customer_portal
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  return lemonSqueezyFetch(`/subscriptions/${subscriptionId}`, {
    method: "DELETE",
  })
}

// Resume a cancelled subscription
export async function resumeSubscription(subscriptionId: string) {
  return lemonSqueezyFetch(`/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        type: "subscriptions",
        id: subscriptionId,
        attributes: {
          cancelled: false,
        },
      },
    }),
  })
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  return lemonSqueezyFetch(`/subscriptions/${subscriptionId}`)
}

// Credit pack configuration - update variant IDs after creating products in LemonSqueezy
export const CREDIT_PACKS = {
  starter: {
    credits: 500,
    price: 29,
    variantId: process.env.LEMONSQUEEZY_STARTER_VARIANT_ID || "",
  },
  growth: {
    credits: 2000,
    price: 99,
    variantId: process.env.LEMONSQUEEZY_GROWTH_VARIANT_ID || "",
  },
  scale: {
    credits: 5000,
    price: 199,
    variantId: process.env.LEMONSQUEEZY_SCALE_VARIANT_ID || "",
  },
  enterprise: {
    credits: 15000,
    price: 499,
    variantId: process.env.LEMONSQUEEZY_ENTERPRISE_VARIANT_ID || "",
  },
} as const
