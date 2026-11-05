import nodemailer from 'nodemailer'

// SMTP configuration from environment
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  from: process.env.SMTP_FROM || 'Wapadrant Gemeente <noreply@gkwapadrant.co.za>',
}

// Create transporter
const createTransporter = () => {
  if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.password) {
    console.warn('⚠️ SMTP nie gekonfigureer nie - e-posse sal na console geskryf word')
    return null
  }

  return nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.password,
    },
  })
}

const transporter = createTransporter()

/**
 * Send ticket confirmation email to buyer
 */
export async function sendTicketConfirmation(
  email: string,
  ticketData: {
    buyerName: string
    tickets: Array<{
      reference: string
      reservation_reference: string | null
      ticketTypeName: string
      ticketPrice: number
      quantity: number
    }>
    eventName: string
    eventDate: string
    eventLocation: string
    totalAmount: number
  }
) {
  const { buyerName, tickets, eventName, eventDate, eventLocation, totalAmount } = ticketData

  const ticketListHtml = tickets
    .map(
      (t) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.reference}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.ticketTypeName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R ${t.ticketPrice.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${t.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R ${(t.ticketPrice * t.quantity).toFixed(2)}</td>
        </tr>
      `
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4a90d9; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .ticket-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
    .ticket-table th { background: #4a90d9; color: white; padding: 12px; text-align: left; }
    .total-row { font-weight: bold; background: #e8f4ff; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎫 Bespreking - ${tickets[0]?.reservation_reference || ''}</h1>
    </div>
    <div class="content">
      <p>Goeie dag, ${buyerName}</p>
      
      <p>Dankie vir jou belangstelling! Hier is jou bevestiging:</p>
      <p>Die kerkkantoor sal binnekort in verbinding wees vir betaling.</p>
      
      <h3>${eventName}</h3>
      <p>
        <strong>Datum:</strong> ${new Date(eventDate).toLocaleDateString('af-ZA', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}<br>
        <strong>Ligging:</strong> ${eventLocation}
      </p>
      
      <table class="ticket-table">
        <thead>
          <tr>
            <th>Verwysing</th>
            <th>Tipe</th>
            <th style="text-align: right;">Prys</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Totaal</th>
          </tr>
        </thead>
        <tbody>
          ${ticketListHtml}
          <tr class="total-row">
            <td colspan="4" style="padding: 12px; text-align: right;">TOTAAL:</td>
            <td style="padding: 12px; text-align: right;">R ${totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      
      <p><strong>Belangrik:</strong> Bring asseblief jou verwysingsnommer(s) wanneer jy by die geleentheid aankom.</p>
      
      <p>Ons sien daarna uit om jou te sien!</p>
      
      <p>Groete,<br>
      <strong>Wapadrant Gemeente</strong></p>
    </div>
    <div class="footer">
      <p>Hierdie is 'n outomatiese e-pos. Moenie hierop antwoord nie.</p>
      <p>Wapadrant Gemeente | Sunrise Road 3, Olympus, Pretoria | 012 991-1395</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Goeie dag, ${buyerName}

Dankie vir jou bespreking! Hier is jou bevestiging:

${eventName}
Datum: ${new Date(eventDate).toLocaleDateString('af-ZA')}
Ligging: ${eventLocation}

Kaartjies:
${tickets.map(t => `- ${t.reference}: ${t.ticketTypeName} x${t.quantity} @ R ${t.ticketPrice.toFixed(2)}`).join('\n')}

TOTAAL: R ${totalAmount.toFixed(2)}

Belangrik: Bring asseblief jou verwysingsnommer(s) wanneer jy by die geleentheid aankom.

Ons sien uit daarna om jou te sien!

Groete,
Wapadrant Gemeente
  `.trim()

  if (!transporter) {
    console.log('📧 TICKET CONFIRMATION EMAIL (SMTP not configured):')
    console.log(`To: ${email}`)
    console.log(`Subject: Jou Kaartjie Bevestiging - ${eventName} - Bespreking: ${tickets[0]?.reservation_reference || ''}`)
    console.log(text)
    return { sent: false, reason: 'SMTP not configured' }
  }

  try {
    await transporter.sendMail({
      from: smtpConfig.from,
      to: email,
      subject: `Jou Kaartjie Bevestiging - ${eventName} - Bespreking: ${tickets[0]?.reservation_reference || ''}`,
      text,
      html,
    })
    console.log(`✅ E-pos suksesvol gestuur na ${email}`)
    return { sent: true }
  } catch (error) {
    console.error('❌ Kon nie e-pos stuur nie:', error)
    throw error
  }
}

/**
 * Send contact form notification to church office
 */
export async function sendContactNotification(
  email: string,
  messageData: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    type: string
  }
) {
  const { name, email: fromEmail, phone, subject, message, type } = messageData

  const typeLabels: Record<string, string> = {
    general: 'Algemene Navraag',
    prayer: 'Gebedversoek',
    volunteer: 'Vrywilliger',
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4a90d9; color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; }
    .message { background: white; padding: 20px; border-left: 4px solid #4a90d9; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📩 Nuwe Kontak Boodskap</h1>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Tipe:</span> ${typeLabels[type] || type}
      </div>
      <div class="field">
        <span class="label">Naam:</span> ${name}
      </div>
      <div class="field">
        <span class="label">E-pos:</span> ${fromEmail}
      </div>
      ${phone ? `<div class="field"><span class="label">Telefoon:</span> ${phone}</div>` : ''}
      <div class="field">
        <span class="label">Onderwerp:</span> ${subject}
      </div>
      <div class="message">
        <strong>Boodskap:</strong><br>
        ${message.replace(/\n/g, '<br>')}
      </div>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Nuwe Kontak Boodskap (${typeLabels[type] || type})

Naam: ${name}
E-pos: ${fromEmail}
${phone ? `Telefoon: ${phone}` : ''}
Onderwerp: ${subject}

Boodskap:
${message}
  `.trim()

  if (!transporter) {
    console.log('📧 CONTACT FORM NOTIFICATION (SMTP not configured):')
    console.log(`To: ${email}`)
    console.log(`Subject: Nuwe Kontak Boodskap - ${subject}`)
    console.log(text)
    return { sent: false, reason: 'SMTP not configured' }
  }

  try {
    await transporter.sendMail({
      from: smtpConfig.from,
      to: email,
      subject: `Nuwe Boodskap - ${subject}`,
      text,
      html,
    })
    console.log(`✅ E-pos gestuur na ${email}`)
    return { sent: true }
  } catch (error) {
    console.error('❌ Kon nie E-pos stuur nie:', error)
    throw error
  }
}

/**
 * Send prayer request notification to church office
 */
export async function sendPrayerRequestNotification(
  email: string,
  requestData: {
    name: string
    email: string
    phone?: string
    request: string
  }
) {
  const { name, email: fromEmail, phone, request } = requestData

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #9b59b6; color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; }
    .prayer { background: white; padding: 20px; border-left: 4px solid #9b59b6; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🙏 Gebedversoek</h1>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Naam:</span> ${name}
      </div>
      <div class="field">
        <span class="label">E-pos:</span> ${fromEmail}
      </div>
      ${phone ? `<div class="field"><span class="label">Telefoon:</span> ${phone}</div>` : ''}
      <div class="prayer">
        <strong>Gebedversoek:</strong><br>
        ${request.replace(/\n/g, '<br>')}
      </div>
      <p style="margin-top: 20px; font-style: italic;">"Die gebed van 'n regverdige het groot krag." - Jakobus 5:16</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Gebedversoek

Naam: ${name}
E-pos: ${fromEmail}
${phone ? `Telefoon: ${phone}` : ''}

Gebedversoek:
${request}

"Die gebed van 'n regverdige het groot krag." - Jakobus 5:16
  `.trim()

  if (!transporter) {
    console.log('📧 PRAYER REQUEST NOTIFICATION (SMTP not configured):')
    console.log(`To: ${email}`)
    console.log(`Subject: Gebed Versoek - ${name}`)
    console.log(text)
    return { sent: false, reason: 'SMTP not configured' }
  }

  try {
    await transporter.sendMail({
      from: smtpConfig.from,
      to: email,
      subject: `Gebed Versoek - ${name}`,
      text,
      html,
    })
    console.log(`✅ Gebedversoek e-pos gestuur na ${email}`)
    return { sent: true }
  } catch (error) {
    console.error('❌ Kon nie gebedversoek e-pos stuur nie:', error)
    throw error
  }
}

/**
 * Send ticket reservation notification to church office
 */
export async function sendReservationNotification( buyerName: string, buyerEmail: string, buyerPhone: string | undefined, eventName: string, ticketCount: number, eventDetails: { date: string; location: string; totalAmount: number; reference?: string; reservation_reference?: string | null; tickets: Array<{ ticketTypeName: string; ticketPrice: number; quantity: number }> } ) {
  const { date, location, totalAmount, tickets, reference, reservation_reference } = eventDetails

  const ticketListHtml = tickets.map((t) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${t.ticketTypeName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R ${t.ticketPrice.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${t.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">R ${(t.ticketPrice * t.quantity).toFixed(2)}</td>
      </tr>`).join('')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #e67e22; color: white; padding: 20px; text-align: center; border-radius: 8px; }
    .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎫 Nuwe Bespreking - ${reservation_reference || ''}</h1>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Koper:</span> ${buyerName}
      </div>
      <div class="field">
        <span class="label">E-pos:</span> ${buyerEmail}
      </div>
      ${buyerPhone ? `<div class="field">
        <span class="label">Telefoon:</span> ${buyerPhone}
      </div>` : ''}
      <div class="field">
        <span class="label">Geleentheid:</span> ${eventName}
      </div>
      <div class="field">
        <span class="label">Datum:</span> ${new Date(date).toLocaleDateString('af-ZA', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
      <div class="field">
        <span class="label">Ligging:</span> ${location}
      </div>
      <div class="field">
        <span class="label">Kaartjies:</span> ${ticketCount}
      </div>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background: white;">
        <thead>
          <tr style="background: #e67e22; color: white;">
            <th style="padding: 10px; text-align: left;">Kaartjie Tipe</th>
            <th style="padding: 10px; text-align: right;">Prys</th>
            <th style="padding: 10px; text-align: center;">Aantal</th>
            <th style="padding: 10px; text-align: right;">Subtotaal</th>
          </tr>
        </thead>
        <tbody>
          ${ticketListHtml}
          <tr style="font-weight: bold; background: #fff3e0;">
            <td colspan="3" style="padding: 10px; text-align: right;">TOTAAL:</td>
            <td style="padding: 10px; text-align: right;">R ${totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Nuwe Bespreking

Koper: ${buyerName}
E-pos: ${buyerEmail}
${buyerPhone ? `Telefoon: ${buyerPhone}` : ''}
Geleentheid: ${eventName}
Datum: ${new Date(date).toLocaleDateString('af-ZA')}
Ligging: ${location}
Kaartjies: ${ticketCount}

Kaartjiekeuse:
${tickets.map(t => `- ${t.ticketTypeName}: ${t.quantity} x R ${t.ticketPrice.toFixed(2)} = R ${(t.ticketPrice * t.quantity).toFixed(2)}`).join('\n')}

Totale Bedrag: R ${totalAmount.toFixed(2)}
  `.trim()

  if (!transporter) {
    console.log('📧 RESERVATION NOTIFICATION (SMTP not configured):')
    console.log(`To: ${process.env.OFFICE_EMAIL || 'kantoor@wapadrant.co.za'}`)
    console.log(`Cc: ${process.env.COPY_EMAIL || ''}`)
    console.log(`Subject: Nuwe Bespreking - ${eventName} - Bespreking: ${reservation_reference || ''}`)
    console.log(text)
    return { sent: false, reason: 'SMTP not configured' }
  }

  try {
    await transporter.sendMail({
      from: smtpConfig.from,
      to: process.env.OFFICE_EMAIL || 'kantoor@gkwapadrant.co.za',
      cc: process.env.COPY_EMAIL || undefined,
      subject: `Nuwe Bespreking - ${eventName} - Bespreking: ${reservation_reference || ''}`,
      text,
      html,
    })
    console.log(`✅ E-pos gestuur na kantoor`)
    return { sent: true }
  } catch (error) {
    console.error('❌ Kon nie besprekings e-pos stuur nie:', error)
    throw error
  }
}
