import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // In production, this would:
  // 1. Verify user has access to this download
  // 2. Check if download is expired
  // 3. Return actual CSV file from storage

  // Mock CSV data for demonstration
  const csvContent = `Company,Contact Name,Email,Title,Phone,Website,LinkedIn
Acme Corp,John Smith,john@acme.com,CEO,+1234567890,www.acme.com,linkedin.com/in/johnsmith
Tech Solutions,Sarah Johnson,sarah@techsolutions.com,CTO,+0987654321,www.techsolutions.com,linkedin.com/in/sarahjohnson
Global Industries,Michael Brown,michael@global.com,Director,+1122334455,www.globalind.com,linkedin.com/in/michaelbrown
Innovation Labs,Emily Davis,emily@innovlabs.com,Founder,+5566778899,www.innovlabs.com,linkedin.com/in/emilydavis
Digital Ventures,Robert Wilson,robert@digitalventures.com,VP Sales,+9988776655,www.digitalventures.com,linkedin.com/in/robertwilson`

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leaddrop-export-${id}.csv"`,
    },
  })
}
