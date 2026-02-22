import { type NextRequest, NextResponse } from "next/server"

// LemonSqueezy checkout API
// Requires: LEMONSQUEEZY_API_KEY and LEMONSQUEEZY_STORE_ID environment variables

export async function POST(request: NextRequest) {
  try {
    const { variantId, userId, userEmail, credits } = await request.json()

    const apiKey = process.env.LEMONSQUEEZY_API_KEY
    const storeId = process.env.LEMONSQUEEZY_STORE_ID

    // If no API key, return mock response for demo
    if (!apiKey || !storeId) {
      console.log("[v0] LemonSqueezy not configured, using demo mode")
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Demo mode - LemonSqueezy not configured",
      })
    }

    // Create checkout via LemonSqueezy API
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: userEmail,
              custom: {
                user_id: userId,
                credits: credits.toString(),
              },
            },
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/credits?success=true`,
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      }),
    })

    const data = await response.json()

    if (data.data?.attributes?.url) {
      return NextResponse.json({
        checkoutUrl: data.data.attributes.url,
      })
    }

    return NextResponse.json(
      {
        error: "Failed to create checkout",
        details: data,
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
