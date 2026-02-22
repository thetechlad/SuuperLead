import { LoginForm } from "@/components/auth/login-form"
import { TrendingUp, Users, Zap, Globe } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Hero with stats matching landing page */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-background">
        {/* Gradient background similar to landing */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />

        {/* Content */}
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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">B2B Leads for Emerging Markets</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Curated B2B Leads.{" "}
                <span className="text-primary relative">
                  Instantly.
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
                Niche-specific, geo-focused lead lists for emerging markets. Download instantly as CSV — no login
                required.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6 max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">2M+</div>
                  <p className="text-sm text-muted-foreground">Leads Available</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">+127%</div>
                  <p className="text-sm text-muted-foreground">Reply Rate</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">50+</div>
                  <p className="text-sm text-muted-foreground">Niche Markets</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">Instant</div>
                  <p className="text-sm text-muted-foreground">CSV Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicator */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["SC", "OA", "PS", "JD"].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: ["#ef4444", "#f97316", "#8b5cf6", "#22c55e"][i] }}
                >
                  <span className="text-white">{initials}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Trusted by 850+ businesses</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
