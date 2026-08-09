export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET() {
  try {
    const session = await auth()
    
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
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, date, endDate, location, imageUrl, isPublished, ticketTypes } = body

    if (!title || !date || !location) {
      return NextResponse.json(
        { error: 'Titel, datum en ligging is vereis' },
        { status: 400 }
      )
    }

    if (!Array.isArray(ticketTypes) || ticketTypes.length === 0) {
      return NextResponse.json(
        { error: 'Ten minste een kaartjie tipe is vereis' },
        { status: 400 }
      )
    }

    const invalidTicketType = ticketTypes.find(
      (tt: any) => !tt.name || typeof tt.price !== 'number' || tt.price < 0 || typeof tt.quantity !== 'number' || tt.quantity <= 0
    )
    if (invalidTicketType) {
      return NextResponse.json(
        { error: 'Alle kaartjie tipes moet geldige name, pryse en hoeveelhede hê' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        location,
        imageUrl: imageUrl || '',
        isPublished: isPublished ?? false,
        ticketTypes: {
          create: ticketTypes.map((tt: any) => ({
            name: tt.name,
            price: tt.price,
            quantity: tt.quantity,
          })),
        },
      },
      include: { ticketTypes: true },
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
