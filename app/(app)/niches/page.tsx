"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportModal } from "@/components/niches/export-modal"
import { Globe, Search, Filter, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Niche {
  id: string
  name: string
  description: string | null
  region: string
  industry: string
  roles: string[]
  lead_count: number
  price_per_lead: number
  status: string
  created_at: string
  updated_at: string
}

const ITEMS_PER_PAGE = 8

const regions = ["All Regions", "UAE", "Saudi Arabia", "Pakistan", "Qatar", "Kuwait", "Bahrain", "GCC", "MENA", "Egypt"]
const sortOptions = [
  { value: "leads-desc", label: "Most Leads" },
  { value: "leads-asc", label: "Least Leads" },
  { value: "cost-asc", label: "Lowest Cost" },
  { value: "cost-desc", label: "Highest Cost" },
  { value: "name", label: "Name A-Z" },
]

export default function NichesPage() {
  const [niches, setNiches] = useState<Niche[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [sortBy, setSortBy] = useState("leads-desc")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchNiches()
  }, [])

  const fetchNiches = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("niches")
      .select("*")
      .eq("status", "active")
      .order("lead_count", { ascending: false })

    if (!error && data) {
      setNiches(data)
    }
    setLoading(false)
  }

  // Filter and sort niches
  const filteredNiches = useMemo(() => {
    const filtered = niches.filter((niche) => {
      const matchesSearch =
        niche.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        niche.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        niche.roles.some((role) => role.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesRegion = selectedRegion === "All Regions" || niche.region === selectedRegion

      return matchesSearch && matchesRegion
    })

    // Sort
    switch (sortBy) {
      case "leads-desc":
        filtered.sort((a, b) => b.lead_count - a.lead_count)
        break
      case "leads-asc":
        filtered.sort((a, b) => a.lead_count - b.lead_count)
        break
      case "cost-asc":
        filtered.sort((a, b) => a.price_per_lead - b.price_per_lead)
        break
      case "cost-desc":
        filtered.sort((a, b) => b.price_per_lead - a.price_per_lead)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [niches, searchQuery, selectedRegion, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredNiches.length / ITEMS_PER_PAGE)
  const paginatedNiches = filteredNiches.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedRegion("All Regions")
    setSortBy("leads-desc")
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || selectedRegion !== "All Regions" || sortBy !== "leads-desc"

  const formatUpdatedAt = (date: string) => {
    const now = new Date()
    const updated = new Date(date)
    const diffDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "1 day ago"
    return `${diffDays} days ago`
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">
              Niche Vaults
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-2">Featured Lead Lists</h1>
            <p className="text-muted-foreground">
              Hand-curated B2B lead lists updated weekly ({filteredNiches.length} niches available)
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search niches by name, region, or role..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-3">
            <Select
              value={selectedRegion}
              onValueChange={(value) => {
                setSelectedRegion(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[180px] bg-input border-border text-foreground">
                <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[160px] bg-input border-border text-foreground">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedRegion !== "All Regions" && (
              <Badge variant="secondary" className="gap-1">
                Region: {selectedRegion}
                <button onClick={() => setSelectedRegion("All Regions")} className="ml-1 hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Niches grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {paginatedNiches.map((niche) => (
            <Card
              key={niche.id}
              className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => setSelectedNiche(niche)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Globe className="h-4 w-4" />
                  {niche.region}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {niche.industry}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {niche.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{niche.roles.join(", ")}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-foreground">{niche.lead_count.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground">leads available</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-primary">
                      {Math.ceil(niche.price_per_lead * 100)} credits
                    </span>
                    <p className="text-xs text-muted-foreground">{formatUpdatedAt(niche.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredNiches.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No niches found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredNiches.length)} of {filteredNiches.length} niches
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="border-border text-foreground hover:bg-accent"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? "bg-primary text-primary-foreground" : "text-muted-foreground"}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="border-border text-foreground hover:bg-accent"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ExportModal niche={selectedNiche} open={!!selectedNiche} onClose={() => setSelectedNiche(null)} />
    </>
  )
}
