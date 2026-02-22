"use client"

import { Suspense, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Database,
  TrendingUp,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Globe,
  Search,
  MoreHorizontal,
} from "lucide-react"
import { niches } from "@/lib/data/niches"

// Mock analytics data
const analytics = {
  totalUsers: 856,
  activeSubscriptions: 234,
  totalRevenue: 45670,
  leadsExported: 1250000,
  monthlyGrowth: 12.5,
}

// Mock users data
const mockUsers = [
  { id: "1", name: "Jane Cooper", email: "jane@example.com", credits: 5000, exports: 45, joined: "Dec 15, 2025" },
  { id: "2", name: "John Smith", email: "john@company.com", credits: 2300, exports: 23, joined: "Dec 20, 2025" },
  { id: "3", name: "Sarah Wilson", email: "sarah@startup.io", credits: 8500, exports: 67, joined: "Nov 5, 2025" },
  { id: "4", name: "Mike Johnson", email: "mike@agency.com", credits: 1200, exports: 12, joined: "Jan 2, 2026" },
  { id: "5", name: "Emily Brown", email: "emily@corp.net", credits: 15000, exports: 89, joined: "Oct 18, 2025" },
]

function AdminContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddNicheOpen, setIsAddNicheOpen] = useState(false)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">
            Admin Dashboard
          </Badge>
          <h1 className="text-3xl font-bold text-foreground">Platform Overview</h1>
          <p className="text-muted-foreground">Manage users, niches, and view analytics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-foreground">{analytics.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-green-500 mt-2">+{analytics.monthlyGrowth}% this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-3xl font-bold text-foreground">{analytics.activeSubscriptions}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Recurring revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">${analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-green-500 mt-2">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads Exported</p>
                <p className="text-3xl font-bold text-foreground">{(analytics.leadsExported / 1000000).toFixed(1)}M</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="niches">Niches</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">User Management</CardTitle>
                  <CardDescription>View and manage all platform users</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-input border-border"
                    />
                  </div>
                  <Button variant="outline" className="border-border bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">User</TableHead>
                    <TableHead className="text-muted-foreground">Credits</TableHead>
                    <TableHead className="text-muted-foreground">Exports</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers
                    .filter(
                      (u) =>
                        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((user) => (
                      <TableRow key={user.id} className="border-border">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{user.credits.toLocaleString()}</TableCell>
                        <TableCell className="text-foreground">{user.exports}</TableCell>
                        <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Niches Tab */}
        <TabsContent value="niches" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Niche Management</CardTitle>
                  <CardDescription>Add, edit, and manage lead niches</CardDescription>
                </div>
                <Dialog open={isAddNicheOpen} onOpenChange={setIsAddNicheOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Niche
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-popover border-border">
                    <DialogHeader>
                      <DialogTitle className="text-popover-foreground">Add New Niche</DialogTitle>
                      <DialogDescription>Create a new lead niche for the platform</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Niche Name</Label>
                        <Input placeholder="e.g., UAE Real Estate Agents" className="bg-input border-border" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Country</Label>
                          <Input placeholder="e.g., UAE" className="bg-input border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label>Region</Label>
                          <Input placeholder="e.g., Middle East" className="bg-input border-border" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Roles (comma separated)</Label>
                        <Input placeholder="e.g., Agents, Brokers" className="bg-input border-border" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Available Leads</Label>
                          <Input type="number" placeholder="e.g., 10000" className="bg-input border-border" />
                        </div>
                        <div className="space-y-2">
                          <Label>Credit Cost (per 100)</Label>
                          <Input type="number" placeholder="e.g., 100" className="bg-input border-border" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Brief description of this niche..." className="bg-input border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label>Upload Lead Data (CSV)</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Drop CSV file here or click to browse</p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddNicheOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-primary text-primary-foreground">Create Niche</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Niche</TableHead>
                    <TableHead className="text-muted-foreground">Region</TableHead>
                    <TableHead className="text-muted-foreground">Leads</TableHead>
                    <TableHead className="text-muted-foreground">Credit Cost</TableHead>
                    <TableHead className="text-muted-foreground">Last Updated</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {niches.slice(0, 8).map((niche) => (
                    <TableRow key={niche.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">{niche.name}</p>
                            <p className="text-sm text-muted-foreground">{niche.country}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{niche.region}</Badge>
                      </TableCell>
                      <TableCell className="text-foreground">{niche.availableLeads.toLocaleString()}</TableCell>
                      <TableCell className="text-foreground">{niche.creditCost} / 100</TableCell>
                      <TableCell className="text-muted-foreground">{niche.updatedAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Transactions</CardTitle>
              <CardDescription>Credit purchases and exports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">User</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-muted-foreground">Description</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border">
                    <TableCell className="text-foreground">Jane Cooper</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-500">Purchase</Badge>
                    </TableCell>
                    <TableCell className="text-green-500">+2,000</TableCell>
                    <TableCell className="text-muted-foreground">Growth credit pack</TableCell>
                    <TableCell className="text-muted-foreground">Jan 6, 2026</TableCell>
                  </TableRow>
                  <TableRow className="border-border">
                    <TableCell className="text-foreground">John Smith</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/10 text-blue-500">Export</Badge>
                    </TableCell>
                    <TableCell className="text-red-500">-500</TableCell>
                    <TableCell className="text-muted-foreground">UAE Real Estate Agents (500 leads)</TableCell>
                    <TableCell className="text-muted-foreground">Jan 5, 2026</TableCell>
                  </TableRow>
                  <TableRow className="border-border">
                    <TableCell className="text-foreground">Sarah Wilson</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-500">Purchase</Badge>
                    </TableCell>
                    <TableCell className="text-green-500">+5,000</TableCell>
                    <TableCell className="text-muted-foreground">Scale credit pack</TableCell>
                    <TableCell className="text-muted-foreground">Jan 5, 2026</TableCell>
                  </TableRow>
                  <TableRow className="border-border">
                    <TableCell className="text-foreground">Emily Brown</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/10 text-blue-500">Export</Badge>
                    </TableCell>
                    <TableCell className="text-red-500">-240</TableCell>
                    <TableCell className="text-muted-foreground">Saudi Tech Founders (300 leads)</TableCell>
                    <TableCell className="text-muted-foreground">Jan 4, 2026</TableCell>
                  </TableRow>
                  <TableRow className="border-border">
                    <TableCell className="text-foreground">Mike Johnson</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-500">Purchase</Badge>
                    </TableCell>
                    <TableCell className="text-green-500">+500</TableCell>
                    <TableCell className="text-muted-foreground">Starter credit pack</TableCell>
                    <TableCell className="text-muted-foreground">Jan 3, 2026</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminContent />
    </Suspense>
  )
}
