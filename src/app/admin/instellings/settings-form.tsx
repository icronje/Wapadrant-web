"use client"

import { useState } from "react"
import { Settings as SettingsIcon, Phone, Mail, MapPin, Clock, Facebook, Youtube } from "lucide-react"

interface SettingsFormProps {
  initialSettings: Record<string, string>
}

const settingFields = [
  { key: "church_name", label: "Kerk Naam", icon: SettingsIcon },
  { key: "church_address", label: "Kerk Adres", icon: MapPin },
  { key: "church_phone", label: "Kerk Telefoon", icon: Phone },
  { key: "church_whatsapp", label: "Kerk WhatsApp", icon: Phone },
  { key: "church_email", label: "Kerk E-pos", icon: Mail },
  { key: "service_times", label: "Diens Tye", icon: Clock },
  { key: "facebook_url", label: "Facebook URL", icon: Facebook },
  { key: "youtube_url", label: "YouTube URL", icon: Youtube },
]

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState(initialSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Instellings suksesvol opgedateer!" })
      } else {
        setMessage({ type: "error", text: "Fout met opdatering van instellings" })
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      setMessage({ type: "error", text: "Fout met opdatering van instellings" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {settingFields.map((field) => {
        const Icon = field.icon
        return (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400" />
                {field.label}
              </div>
            </label>
            <input
              type={field.key.includes("email") ? "email" : "text"}
              value={formData[field.key] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field.key]: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )
      })}

      <div className="pt-6 border-t">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Stoor..." : "Stoor Instellings"}
        </button>
      </div>
    </form>
  )
}
