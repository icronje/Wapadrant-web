import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Calendar, Mic, Megaphone, MessageSquare, Users, Ticket } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  // Fetch stats
  const [eventCount, ticketCount, sermonCount, messageCount] = await Promise.all([
    prisma.event.count(),
    prisma.ticket.count(),
    prisma.sermon.count(),
    prisma.contactMessage.count({ where: { status: "new" } }),
  ])

  const stats = [
    { label: "Gebeurtenisse", value: eventCount, icon: Calendar, color: "bg-blue-500" },
    { label: "Tickets Verkoop", value: ticketCount, icon: Ticket, color: "bg-green-500" },
    { label: "Preke", value: sermonCount, icon: Mic, color: "bg-purple-500" },
    { label: "Nuwe Boodskappe", value: messageCount, icon: MessageSquare, color: "bg-orange-500" },
  ]

  const quickLinks = [
    { href: "/admin/gebeurtenisse", label: "Gebeurtenisse", icon: Calendar },
    { href: "/admin/preke", label: "Preke", icon: Mic },
    { href: "/admin/aankondigings", label: "Aankondigings", icon: Megaphone },
    { href: "/admin/boodskappe", label: "Boodskappe", icon: MessageSquare },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Bestuur</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vinnige Skakels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
