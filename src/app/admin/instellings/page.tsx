import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Settings as SettingsIcon, Phone, Mail, MapPin, Clock, Share2 } from "lucide-react"
import SettingsForm from "./settings-form"

interface Setting {
  key: string
  value: string
}

const settingLabels: Record<string, string> = {
  church_name: "Kerk Naam",
  church_address: "Kerk Adres",
  church_phone: "Kerk Telefoon",
  church_whatsapp: "Kerk WhatsApp",
  church_email: "Kerk E-pos",
  service_times: "Diens Tye",
  facebook_url: "Share2 URL",
  youtube_url: "YouTube URL",
}

const settingIcons: Record<string, React.ComponentType<any>> = {
  church_name: SettingsIcon,
  church_address: MapPin,
  church_phone: Phone,
  church_whatsapp: Phone,
  church_email: Mail,
  service_times: Clock,
  facebook_url: Share2,
  youtube_url: Share2,
}

export default async function AdminSettings() {
  const session = await auth()

  if (!session?.user) {
    redirect("/admin/login")
  }

  const settings = await prisma.setting.findMany()
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Instellings</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <SettingsForm initialSettings={settingsMap} />
      </div>
    </div>
  )
}
