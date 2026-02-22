"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Search, Filter, Globe, ChevronLeft, ChevronRight, FileText, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/lib/hooks/use-user"
import { createClient } from "@/lib/supabase/client"

interface DownloadItem {
  id: string
  created_at: string
  lead_count: number
  credits_used: number
  file_url: string | null
  file_name: string | null
  status: string
  niche: {
    id: string
    name: string
    region: string
    industry: string
    roles: string[]
  } | null
}

const ITEMS_PER_PAGE = 6

export default function DownloadsPage() {
  const { profile } = useUser()
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (profile) {
      fetchDownloads()
    }
  }, [profile])

  const fetchDownloads = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("downloads")
      .select(
        `
        *,
        niche:niches(id, name, region, industry, roles)
      `,
      )
      .eq("user_id", profile!.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setDownloads(data)
    }
    setLoading(false)
  }

  // Filter downloads
  const filteredDownloads = downloads.filter((download) => {
    const matchesSearch =
      download.niche?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      download.niche?.region.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || download.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredDownloads.length / ITEMS_PER_PAGE)
  const paginatedDownloads = filteredDownloads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleDownload = (download: DownloadItem) => {
    if (download.file_url) {
      window.open(download.file_url, "_blank")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || statusFilter !== "all"

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">
            <FileText className="h-3 w-3 mr-1" />
            Export History
          </Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">Download History</h1>
          <p className="text-muted-foreground">
            Access all your previously exported lead files ({filteredDownloads.length} exports)
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by niche or region..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[150px] bg-input border-border text-foreground">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
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

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Niche</TableHead>
                <TableHead className="text-muted-foreground">Region</TableHead>
                <TableHead className="text-muted-foreground">Leads</TableHead>
                <TableHead className="text-muted-foreground">Credits Used</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDownloads.map((download) => (
                <TableRow key={download.id} className="border-border hover:bg-accent/50">
                  <TableCell className="font-medium text-foreground">{formatDate(download.created_at)}</TableCell>
                  <TableCell className="text-foreground">{download.niche?.name || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      {download.niche?.region || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{download.lead_count.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{download.credits_used.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        download.status === "completed"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : download.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      }
                    >
                      {download.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-accent bg-transparent"
                      disabled={download.status !== "completed" || !download.file_url}
                      onClick={() => handleDownload(download)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty state */}
          {filteredDownloads.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No downloads found</h3>
              <p className="text-muted-foreground mb-4">
                {downloads.length === 0 ? "You haven't exported any leads yet" : "Try adjusting your search or filters"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredDownloads.length)} of {filteredDownloads.length} downloads
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
  )
}
