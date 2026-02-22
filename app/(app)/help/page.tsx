"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  MessageCircle,
  Mail,
  FileText,
  Zap,
  CreditCard,
  Download,
  RefreshCw,
  ArrowRight,
  ExternalLink,
} from "lucide-react"

const faqs = [
  {
    question: "How do credits work?",
    answer:
      "Credits are used to export leads from our database. Each niche has a different credit cost based on the quality and specificity of the leads. When you export leads, credits are deducted from your account balance. You can purchase more credits anytime or subscribe to a plan for monthly credits.",
  },
  {
    question: "What format are the lead exports?",
    answer:
      "All lead exports are delivered as CSV (Comma-Separated Values) files. This format is compatible with all major CRM systems, email marketing tools, and spreadsheet applications like Excel and Google Sheets.",
  },
  {
    question: "How often is the lead data updated?",
    answer:
      "Our lead database is updated continuously. Each niche shows when it was last updated. Most niches are refreshed weekly to ensure you always have access to the most current and accurate contact information.",
  },
  {
    question: "Can I get a refund for unused credits?",
    answer:
      "Credits are non-refundable but never expire. If you encounter any issues with lead quality, please contact our support team and we'll work with you to resolve the situation.",
  },
  {
    question: "How do subscriptions work?",
    answer:
      "Subscriptions automatically deliver fresh leads from your chosen niches on a regular schedule (weekly, bi-weekly, or monthly). You'll receive an email notification when new leads are ready for download. You can pause or cancel subscriptions at any time.",
  },
  {
    question: "What's included in each lead record?",
    answer:
      "Each lead typically includes: Company name, Contact name, Email address, Job title, Phone number (when available), Website URL, and LinkedIn profile URL. The specific fields may vary by niche.",
  },
  {
    question: "Do you offer bulk discounts?",
    answer:
      "Yes! We offer volume discounts for large credit purchases. Contact our sales team for custom pricing on orders over 50,000 credits.",
  },
  {
    question: "How accurate is the lead data?",
    answer:
      "We maintain a 95%+ accuracy rate on email addresses. Our data goes through multiple verification processes including real-time email validation. Leads that bounce can be reported for credit refunds.",
  },
]

const categories = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Learn the basics of using LeadDrop",
    articles: 8,
  },
  {
    icon: CreditCard,
    title: "Credits & Billing",
    description: "Understand pricing and payments",
    articles: 12,
  },
  {
    icon: Download,
    title: "Exports & Downloads",
    description: "How to export and use your leads",
    articles: 6,
  },
  {
    icon: RefreshCw,
    title: "Subscriptions",
    description: "Managing recurring lead deliveries",
    articles: 5,
  },
]

export default function HelpPage() {
  return (
    <div className="p-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">How can we help?</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Search our knowledge base or browse categories below to find answers.
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Card
            key={category.title}
            className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
          >
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <category.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
              <p className="text-xs text-primary">{category.articles} articles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Frequently Asked Questions</CardTitle>
          <CardDescription className="text-muted-foreground">
            Quick answers to common questions about LeadDrop.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger className="text-foreground hover:text-primary text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">Chat with our support team in real-time.</p>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Start Chat
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">Get help via email within 24 hours.</p>
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent bg-transparent">
              support@leaddrop.com
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground mb-4">Read our detailed guides and API docs.</p>
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent bg-transparent">
              View Docs
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Still need help banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">Still need help?</h3>
              <p className="text-muted-foreground">Our team is here to assist you with any questions or issues.</p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
