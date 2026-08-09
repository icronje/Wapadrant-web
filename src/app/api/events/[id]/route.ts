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
        ticketTypes: true,
        tickets: true,
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Geleentheid nie gevind nie' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
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

    const existingTicketTypes = await prisma.ticketType.findMany({ where: { eventId: id } })

    // Update event core fields
    await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        location,
        imageUrl,
        isPublished,
      },
    })

    // Update or create ticket types
    if (Array.isArray(ticketTypes)) {
      for (const tt of ticketTypes) {
        if (tt.id && existingTicketTypes.find((existing) => existing.id === tt.id)) {
          await prisma.ticketType.update({
            where: { id: tt.id },
            data: {
              name: tt.name,
              price: tt.price,
              quantity: tt.quantity,
            },
          })
        } else {
          await prisma.ticketType.create({
            data: {
              eventId: id,
              name: tt.name,
              price: tt.price,
              quantity: tt.quantity,
            },
          })
        }
      }

      // Remove ticket types not included in update payload
      const updatedIds = ticketTypes.map((tt: any) => tt.id).filter(Boolean)
      const toDelete = existingTicketTypes.filter((existing) => !updatedIds.includes(existing.id))
      if (toDelete.length > 0) {
        await prisma.ticketType.deleteMany({
          where: { id: { in: toDelete.map((t) => t.id) } },
        })
      }
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: { ticketTypes: true },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error updating event:', error)
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
