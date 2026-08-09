export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendTicketConfirmation } from '@/lib/email'


function generateReference(eventId: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `WPR-${eventId}-${suffix}`
}


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
    const { buyerName, buyerEmail, buyerPhone, items } = body

    // Validate required fields
    if (!buyerName) {
      return NextResponse.json(
        { error: 'Naam is vereis' },
        { status: 400 }
      )
    }

    if (!buyerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      return NextResponse.json(
        { error: 'Geldige e-pos adres is vereis' },
        { status: 400 }
      )
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Ten minste een kaartjie item is vereis' },
        { status: 400 }
      )
    }

    // Validate each item
    for (const item of items) {
      if (!item.ticketTypeId) {
        return NextResponse.json(
          { error: 'Kaartjie tipe ID is vereis vir elke item' },
          { status: 400 }
        )
      }
      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Hoeveelheid moet groter as 0 wees' },
          { status: 400 }
        )
      }
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

    // Process purchase in transaction
    const result = await prisma.$transaction(async (tx) => {
      const createdTickets = []
      let totalAmount = 0

      for (const item of items) {
        const ticketType = await tx.ticketType.findUnique({
          where: { id: item.ticketTypeId },
        })

        if (!ticketType) {
          throw new Error(`Kaartjie tipe nie gevind nie: ${item.ticketTypeId}`)
        }

        if (ticketType.eventId !== eventId) {
          throw new Error(`Kaartjie tipe behoort nie tot hierdie geleentheid nie`)
        }

        const availableQuantity = ticketType.quantity - ticketType.sold
        if (item.quantity > availableQuantity) {
          throw new Error(`Nie genoeg ${ticketType.name} kaartjies beskikbaar nie`)
        }

        const itemTotal = ticketType.price.mul(item.quantity)
        totalAmount += itemTotal.toNumber()

        const reference = generateReference(eventId)

        const ticket = await tx.ticket.create({
          data: {
            eventId,
            ticketTypeId: item.ticketTypeId,
            buyerName,
            buyerEmail,
            buyerPhone: buyerPhone || null,
            quantity: item.quantity,
            totalAmount: itemTotal,
            status: 'confirmed',
          },
        })

        // Update sold count
        await tx.ticketType.update({
          where: { id: item.ticketTypeId },
          data: {
            sold: { increment: item.quantity },
          },
        })

        createdTickets.push({
          ...ticket,
          reference,
          ticketTypeName: ticketType.name,
          ticketPrice: ticketType.price.toNumber(),
        })
      }

      return { createdTickets, totalAmount }
    })

    // Send confirmation email (non-blocking, don't fail purchase if email fails)
    try {
      await sendTicketConfirmation(buyerEmail, {
        buyerName,
        tickets: result.createdTickets,
        eventName: event.title,
        eventDate: event.date.toISOString(),
        eventLocation: event.location,
        totalAmount: result.totalAmount,
      })
      console.log(`✅ E-pos bevestiging gestuur na ${buyerEmail}`)
    } catch (emailError) {
      console.error('❌ Kon nie e-pos bevestiging stuur nie:', emailError)
      // Don't fail the purchase - just log the error
    }

    return NextResponse.json({
      tickets: result.createdTickets,
      totalAmount: result.totalAmount,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error purchasing ticket:', error)
    return NextResponse.json(
      { error: error.message || 'Kon nie kaartjie koop nie' },
      { status: error.message?.includes('nie beskikbaar') ? 404 : 400 }
    )
  }
}
