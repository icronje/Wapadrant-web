export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
      return NextResponse.json(
        { error: 'Ongeoorloofd - admin regte vereis' },
        { status: 403 }
      )
    }

    const { id } = await params

    const tickets = await prisma.ticket.findMany({
      where: { eventId: id },
      include: {
        ticketType: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Kon nie kaartjies ophaal nie' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    const body = await request.json()
    const { ticketTypeId, buyerName, buyerEmail, buyerPhone, quantity } = body

    if (!ticketTypeId || !buyerName || !buyerEmail || !quantity) {
      return NextResponse.json(
        { error: 'Vereiste velde ontbreek' },
        { status: 400 }
      )
    }

    // Verify event exists and is published
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event || !event.isPublished) {
      return NextResponse.json(
        { error: 'Geleentheid nie beskikbaar nie' },
        { status: 404 }
      )
    }

    // Get ticket type and check availability
    const ticketType = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
    })

    if (!ticketType) {
      return NextResponse.json(
        { error: 'Kaartjie tipe nie gevind nie' },
        { status: 404 }
      )
    }

    const availableQuantity = ticketType.quantity - ticketType.sold
    if (quantity > availableQuantity) {
      return NextResponse.json(
        { error: 'Nie genoeg kaartjies beskikbaar nie' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = ticketType.price.mul(quantity)

    // Create ticket and update sold count in transaction
    const [ticket] = await prisma.$transaction([
      prisma.ticket.create({
        data: {
          eventId,
          ticketTypeId,
          buyerName,
          buyerEmail,
          buyerPhone,
          quantity,
          totalAmount,
        },
      }),
      prisma.ticketType.update({
        where: { id: ticketTypeId },
        data: {
          sold: { increment: quantity },
        },
      }),
    ])

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Error purchasing ticket:', error)
    return NextResponse.json(
      { error: 'Kon nie kaartjie koop nie' },
      { status: 500 }
    )
  }
}
