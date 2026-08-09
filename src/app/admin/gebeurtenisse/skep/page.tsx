"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Calendar, MapPin, Image as ImageIcon } from "lucide-react"

interface TicketType {
  name: string
  price: string
  quantity: string
}

export default function CreateEventPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: "", price: "", quantity: "" },
  ])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: "",
  })

  const handleAddTicketType = () => {
    setTicketTypes([...ticketTypes, { name: "", price: "", quantity: "" }])
  }

  const handleRemoveTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index))
  }

  const handleTicketTypeChange = (
    index: number,
    field: keyof TicketType,
    value: string
  ) => {
    const newTicketTypes = [...ticketTypes]
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value }
    setTicketTypes(newTicketTypes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ticketTypes: ticketTypes.map((tt) => ({
            name: tt.name,
            price: parseFloat(tt.price) || 0,
            quantity: parseInt(tt.quantity) || 0,
          })),
        }),
      })

      if (response.ok) {
        router.push("/admin/gebeurtenisse")
        router.refresh()
      } else {
        alert("Fout met skep van gebeurtenis")
      }
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Fout met skep van gebeurtenis")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Skep Nuwe Gebeurtenis</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titel *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="bv. Jeugkamp 2026"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beskrywing
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Beskryf die gebeurtenis..."
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datum *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ligging *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="bv. Wapadrant Kerksaal"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beeld URL
            </label>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Ticket Types */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Ticket Tipes</h3>
              <button
                type="button"
                onClick={handleAddTicketType}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                Voeg Ticket Type By
              </button>
            </div>

            <div className="space-y-3">
              {ticketTypes.map((ticketType, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <input
                    type="text"
                    placeholder="Naam"
                    value={ticketType.name}
                    onChange={(e) =>
                      handleTicketTypeChange(index, "name", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Prys (R)"
                    value={ticketType.price}
                    onChange={(e) =>
                      handleTicketTypeChange(index, "price", e.target.value)
                    }
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Hoeveelheid"
                    value={ticketType.quantity}
                    onChange={(e) =>
                      handleTicketTypeChange(index, "quantity", e.target.value)
                    }
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTicketType(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Kanselleer
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Skep..." : "Skep Gebeurtenis"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
