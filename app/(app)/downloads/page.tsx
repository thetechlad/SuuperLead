import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

const downloads = [
  {
    id: 1,
    date: "Jan 4, 2026",
    niche: "SaaS Founders - USA",
    leadCount: 500,
    status: "ready",
  },
  {
    id: 2,
    date: "Jan 3, 2026",
    niche: "Marketing Directors - UK",
    leadCount: 300,
    status: "ready",
  },
  {
    id: 3,
    date: "Jan 2, 2026",
    niche: "E-commerce CEOs - Germany",
    leadCount: 400,
    status: "ready",
  },
  {
    id: 4,
    date: "Jan 1, 2026",
    niche: "Tech CTOs - Canada",
    leadCount: 600,
    status: "ready",
  },
  {
    id: 5,
    date: "Dec 30, 2025",
    niche: "Finance Directors - Australia",
    leadCount: 250,
    status: "ready",
  },
  {
    id: 6,
    date: "Dec 28, 2025",
    niche: "Sales VPs - USA",
    leadCount: 550,
    status: "ready",
  },
]

export default function DownloadsPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Download History</h1>
        <p className="text-muted-foreground">Access all your previously exported lead files.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Niche</TableHead>
                <TableHead>Lead Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloads.map((download) => (
                <TableRow key={download.id}>
                  <TableCell className="font-medium text-foreground">{download.date}</TableCell>
                  <TableCell className="text-foreground">{download.niche}</TableCell>
                  <TableCell className="text-muted-foreground">{download.leadCount} leads</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {download.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
