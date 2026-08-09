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
      <h1>🎫 Kaartjie Bevestiging</h1>
    </div>
    <div class="content">
      <p>Goeiemôre ${buyerName},</p>
      
      <p>Dankie vir jou kaartjie(s)! Hier is jou bevestiging:</p>
      
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
      
      <p>Ons sien uit daarna om jou te sien!</p>
      
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
Goeiemôre ${buyerName},

Dankie vir jou kaartjie(s)! Hier is jou bevestiging:

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
    console.log(`Subject: Jou Kaartjie Bevestiging - ${eventName}`)
    console.log(text)
    return { sent: false, reason: 'SMTP not configured' }
  }

  try {
    await transporter.sendMail({
      from: smtpConfig.from,
      to: email,
      subject: `Jou Kaartjie Bevestiging - ${eventName}`,
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
    prayer: 'Gebed Versoek',
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
      subject: `Nuwe Kontak Boodskap - ${subject}`,
      text,
      html,
    })
    console.log(`✅ Kontak boodskap e-pos gestuur na ${email}`)
    return { sent: true }
  } catch (error) {
    console.error('❌ Kon nie kontak boodskap e-pos stuur nie:', error)
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
      <h1>🙏 Gebed Versoek</h1>
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
        <strong>Gebed Versoek:</strong><br>
        ${request.replace(/\n/g, '<br>')}
      </div>
      <p style="margin-top: 20px; font-style: italic;">"Die gebed van 'n regverdige het groot krag." - Jakobus 5:16</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
Gebed Versoek

Naam: ${name}
E-pos: ${fromEmail}
${phone ? `Telefoon: ${phone}` : ''}

Gebed Versoek:
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
    console.log(`✅ Gebed versoek e-pos gestuur na ${email}`)
    return { sent: true }
  } catch (error) {
    console.error('❌ Kon nie gebed versoek e-pos stuur nie:', error)
    throw error
  }
}
