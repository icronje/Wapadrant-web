import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // If authenticated admin/editor, show all events
    // If not authenticated, show only published events
    const where = session?.user?.role === 'admin' || session?.user?.role === 'editor'
      ? {}
      : { isPublished: true }

    const events = await prisma.event.findMany({
      where,
      include: {
        ticketTypes: true,
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Kon nie geleenthede ophaal nie' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, date, location, imageUrl, isPublished } = body

    if (!title || !date || !location) {
      return NextResponse.json(
        { error: 'Titel, datum en ligging is vereis' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        imageUrl: imageUrl || '',
        isPublished: isPublished ?? false,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Kon nie geleentheid skep nie' },
      { status: 500 }
    )
  }
}
