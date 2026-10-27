import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import Link from "next/link"
import { Megaphone, Tag, Calendar, Plus, Pencil } from "lucide-react"

const typeLabels: Record<string, string> = {
  general: "Algemeen",
  birthday: "Verjaarsdag",
  news: "Nuus",
  gksa: "GKSA",
}

const typeColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-800",
  birthday: "bg-purple-100 text-purple-800",
  news: "bg-green-100 text-green-800",
  gksa: "bg-orange-100 text-orange-800",
}

export default async function AdminAnnouncements() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { publishedAt: "desc" },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Aankondigings</h1>
        <Link
          href="/admin/aankondigings/skep"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Skep Nuwe Aankondiging</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gepubliseer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksie
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {announcements.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Geen aankondigings nie.
                </td>
              </tr>
            ) : (
              announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/admin/aankondigings/${announcement.id}`} className="flex items-center">
                      <Megaphone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800">{announcement.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-md">
                          {announcement.content}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-gray-400" />
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          typeColors[announcement.type] || typeColors.general
                        }`}
                      >
                        {typeLabels[announcement.type] || announcement.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {format(announcement.publishedAt, "dd MMM yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/aankondigings/${announcement.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}