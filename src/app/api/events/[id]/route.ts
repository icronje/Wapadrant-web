export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    
    const where = session?.user?.role === 'admin' || session?.user?.role === 'editor'
      ? { id }
      : { id, isPublished: true }

    const event = await prisma.event.findUnique({
      where,
      include: {
        ticketTypes: {
          include: {
            _count: {
              select: { tickets: true }
            }
          }
        },
        tickets: {
          include: {
            ticketType: true,
          }
        }
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Geleentheid nie gevind nie' },
        { status: 404 }
      )
    }

    // Calculate total revenue
    const totalRevenue = event.ticketTypes.reduce((sum, tt) => {
      return sum + (tt.price.toNumber() * tt.sold)
    }, 0)

    // Transform response
    const transformedEvent = {
      ...event,
      ticketTypes: event.ticketTypes.map(tt => ({
        ...tt,
        sold: tt.sold,
        _count: { tickets: tt._count.tickets }
      })),
      totalRevenue,
    }

    return NextResponse.json(transformedEvent)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Kon nie geleentheid ophaal nie' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, description, date, endDate, location, imageUrl, isPublished, ticketTypes } = body

    // Update event and ticket types in a transaction
    const updatedEvent = await prisma.$transaction(async (tx) => {
      // Update the event itself
      const event = await tx.event.update({
        where: { id },
        data: {
          title,
          description: description || null,
          date: date ? new Date(date) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          location,
          imageUrl,
          isPublished,
        },
      })

      // Handle ticket types if provided
      if (ticketTypes && Array.isArray(ticketTypes)) {
        // Get existing ticket types
        const existingTicketTypes = await tx.ticketType.findMany({
          where: { eventId: id },
          include: {
            _count: {
              select: { tickets: true }
            }
          }
        })

        const existingIds = new Set(existingTicketTypes.map(tt => tt.id))
        const incomingIds = new Set<string>()

        // Update or create ticket types
        for (const tt of ticketTypes) {
          if (tt.id && existingIds.has(tt.id)) {
            // Update existing ticket type
            await tx.ticketType.update({
              where: { id: tt.id },
              data: {
                name: tt.name,
                price: tt.price,
                quantity: tt.quantity,
              },
            })
            incomingIds.add(tt.id)
          } else if (!tt.id) {
            // Create new ticket type
            await tx.ticketType.create({
              data: {
                eventId: id,
                name: tt.name,
                price: tt.price,
                quantity: tt.quantity,
                sold: 0,
              },
            })
          }
        }

        // Delete ticket types that are not in the incoming list
        for (const existing of existingTicketTypes) {
          if (!incomingIds.has(existing.id)) {
            // Check if tickets have been sold for this type
            if (existing._count.tickets > 0) {
              // Cannot delete - has tickets
              throw new Error(`Kan nie kaartjie tipe "${existing.name}" verwyder nie - daar is reeds kaartjies verkoop`)
            }
            // Safe to delete
            await tx.ticketType.delete({
              where: { id: existing.id },
            })
          }
        }
      }

      return tx.event.findUnique({
        where: { id },
        include: {
          ticketTypes: true,
        },
      })
    })

    return NextResponse.json(updatedEvent)
  } catch (error: any) {
    console.error('Error updating event:', error)
    if (error.message?.includes('verwyder')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Kon nie geleentheid opdateer nie' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const { id } = await params
    
    // Check if event has tickets
    const ticketCount = await prisma.ticket.count({
      where: { eventId: id },
    })

    if (ticketCount > 0) {
      return NextResponse.json(
        { error: 'Kan nie geleentheid verwyder nie - daar is reeds kaartjies verkoop' },
        { status: 400 }
      )
    }
    
    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Kon nie geleentheid verwyder nie' },
      { status: 500 }
    )
  }
}
