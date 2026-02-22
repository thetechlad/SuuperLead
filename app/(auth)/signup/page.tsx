import { SignupForm } from "@/components/auth/signup-form"
import { Zap, Users, TrendingUp, Gift } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">LD</span>
            </div>
            <span className="text-xl font-semibold text-foreground">LeadDrop</span>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">100 Free Credits on Signup</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Start Growing{" "}
                <span className="text-primary relative">
                  Today.
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                    <path
                      d="M0 4 Q50 8 100 4 Q150 0 200 4"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-primary"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Join 850+ businesses using LeadDrop to find qualified B2B leads in emerging markets.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Instant Access</p>
                  <p className="text-sm text-muted-foreground">Download leads immediately as CSV</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">2M+ Verified Leads</p>
                  <p className="text-sm text-muted-foreground">Across 50+ niche markets</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">+127% Reply Rate</p>
                  <p className="text-sm text-muted-foreground">Compared to generic lead lists</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-foreground">50+</p>
              <p className="text-sm text-muted-foreground">Niche Markets</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Regions Covered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">Weekly</p>
              <p className="text-sm text-muted-foreground">Data Updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
