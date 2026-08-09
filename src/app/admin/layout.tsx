import { auth } from "@/lib/auth"
import Link from "next/link"
import { LayoutDashboard, Calendar, Mic, Megaphone, MessageSquare, Settings, LogOut, Images, Newspaper } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth()

  // Not logged in — render children bare (middleware handles redirect for non-login pages)
  if (!session?.user) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  const navItems = [
    { href: "/admin", label: "Bestuur", icon: LayoutDashboard },
    { href: "/admin/gebeurtenisse", label: "Gebeurtenisse", icon: Calendar },
    { href: "/admin/preke", label: "Preke", icon: Mic },
    { href: "/admin/aankondigings", label: "Aankondigings", icon: Megaphone },
    { href: "/admin/nuusbriewe", label: "Nuusbriewe", icon: Newspaper },
    { href: "/admin/foto-albums", label: "Foto Albums", icon: Images },
    { href: "/admin/boodskappe", label: "Boodskappe", icon: MessageSquare },
    { href: "/admin/instellings", label: "Instellings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Wapadrant Admin</h1>
          <p className="text-sm text-gray-500 mt-1">{session.user.name || session.user.email}</p>
        </div>
        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mb-1"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="mt-6 px-3">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 w-full text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Teken Uit</span>
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
