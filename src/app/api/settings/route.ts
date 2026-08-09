export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))
    return NextResponse.json(settingsMap)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Kon nie instellings ophaal nie' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updates = body

    // Update each setting
    const updatePromises = Object.entries(updates).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key: key as string },
        update: { value: value as string },
        create: { key: key as string, value: value as string },
      })
    )

    await Promise.all(updatePromises)

    const settings = await prisma.setting.findMany()
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

    return NextResponse.json(settingsMap)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Kon nie instellings opdateer nie' },
      { status: 500 }
    )
  }
}
