export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    
    const upcoming = searchParams.get('upcoming') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    
    // Build where clause
    const where: any = {}
    
    // If not authenticated admin/editor, only show published events
    if (session?.user?.role !== 'admin' && session?.user?.role !== 'editor') {
      where.isPublished = true
    }
    
    // Filter for upcoming events if requested
    if (upcoming) {
      where.date = { gte: new Date() }
    }
    
    const events = await prisma.event.findMany({
      where,
      include: {
        ticketTypes: {
          include: {
            _count: {
              select: { tickets: true }
            }
          }
        },
        _count: {
          select: { tickets: true }
        }
      },
      orderBy: { date: 'asc' },
      ...(limit ? { take: limit } : {}),
    })

    // Transform events to include sold counts and ticketTypes with counts
    const transformedEvents = events.map(event => ({
      ...event,
      ticketTypes: event.ticketTypes.map(tt => ({
        ...tt,
        sold: tt.sold,
        _count: { tickets: tt._count.tickets }
      })),
      totalTicketsSold: event._count.tickets,
      totalRevenue: event.ticketTypes.reduce((sum, tt) => {
        return sum + (tt.price.toNumber() * tt.sold)
      }, 0)
    }))

    return NextResponse.json(transformedEvents)
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

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Titel is vereis' },
        { status: 400 }
      )
    }

    if (!date) {
      return NextResponse.json(
        { error: 'Datum is vereis' },
        { status: 400 }
      )
    }

    if (!ticketTypes || !Array.isArray(ticketTypes) || ticketTypes.length === 0) {
      return NextResponse.json(
        { error: 'Ten minste een kaartjie tipe is vereis' },
        { status: 400 }
      )
    }

    // Validate ticket types
    for (const tt of ticketTypes) {
      if (!tt.name || !tt.price || !tt.quantity) {
        return NextResponse.json(
          { error: 'Elke kaartjie tipe benodig naam, prys en hoeveelheid' },
          { status: 400 }
        )
      }
    }

    // Create event with ticket types in a single transaction
    const event = await prisma.$transaction(async (tx) => {
      const createdEvent = await tx.event.create({
        data: {
          title,
          description: description || null,
          date: new Date(date),
          endDate: endDate ? new Date(endDate) : null,
          location,
          imageUrl: imageUrl || '',
          isPublished: isPublished ?? false,
        },
      })

      const createdTicketTypes = await tx.ticketType.createMany({
        data: ticketTypes.map((tt: any) => ({
          eventId: createdEvent.id,
          name: tt.name,
          price: tt.price,
          quantity: tt.quantity,
          sold: 0,
        })),
      })

      return tx.event.findUnique({
        where: { id: createdEvent.id },
        include: {
          ticketTypes: true,
        },
      })
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
