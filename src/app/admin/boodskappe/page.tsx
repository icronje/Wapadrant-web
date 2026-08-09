import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { MessageSquare, Mail, User, Phone } from "lucide-react"

const statusLabels: Record<string, string> = {
  new: "Nuut",
  read: "Gelees",
  responded: "Beantwoord",
  closed: "Gesluit",
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  read: "bg-gray-100 text-gray-800",
  responded: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-800",
}

const typeLabels: Record<string, string> = {
  general: "Algemeen",
  prayer: "Gebed",
  volunteer: "Vrywilliger",
}

export default async function AdminMessages() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Boodskappe</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Afzender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Onderwerp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                    <p>Geen boodskappe nie</p>
                  </div>
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        {message.name}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {message.email}
                      </div>
                      {message.phone && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {message.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{message.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{message.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {typeLabels[message.type] || message.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        statusColors[message.status] || statusColors.new
                      }`}
                    >
                      {statusLabels[message.status] || message.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(message.createdAt, "dd MMM yyyy")}
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
