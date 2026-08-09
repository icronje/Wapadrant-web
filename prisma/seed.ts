import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Begin met seed data vir Wapadrant Gemeente...")

  // Hash password for admin user (default: admin123)
  const hashedPassword = await bcrypt.hash("admin123", 10)

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Kerk Admin",
      email: "kantoor@gkwapadrant.co.za",
      role: "admin",
    },
  })
  console.log("✅ Admin gebruiker geskep")

  // Create Events
  const herfsKamp = await prisma.event.upsert({
    where: { id: "herfs-kamp-2026" },
    update: {},
    create: {
      id: "herfs-kamp-2026",
      title: "Herfs Kamp 2026",
      description: "Jaarlikse herfskamp vir die hele gemeente",
      date: new Date("2026-04-18T09:00:00+02:00"),
      location: "Wapadrant Kerksaal",
      imageUrl: "/images/herfs-kamp-2026.jpg",
      isPublished: true,
    },
  })

  const jeugkonferensie = await prisma.event.upsert({
    where: { id: "jeugkonferensie-2026" },
    update: {},
    create: {
      id: "jeugkonferensie-2026",
      title: "Jeugkonferensie 2026",
      description: "Jeugkonferensie 09-12 April",
      date: new Date("2026-04-09T18:00:00+02:00"),
      location: "Olympus",
      imageUrl: "/images/jeugkonferensie-2026.jpg",
      isPublished: true,
    },
  })

  const kersdiens = await prisma.event.upsert({
    where: { id: "kersdiens-2026" },
    update: {},
    create: {
      id: "kersdiens-2026",
      title: "Kersdiens 2026",
      description: "Kersviering saam met die hele gemeente",
      date: new Date("2026-12-24T18:00:00+02:00"),
      location: "Wapadrant Kerk",
      imageUrl: "/images/kersdiens-2026.jpg",
      isPublished: true,
    },
  })
  console.log("✅ Gebeurtenisse geskep")

  // Create Riana Nel Konser event with ticket types
  const rianaNelKonser = await prisma.event.upsert({
    where: { id: "riana-nel-konser-2026" },
    update: {},
    create: {
      id: "riana-nel-konser-2026",
      title: "Riana Nel Konser",
      description: "'n Wonderlike aand met Riana Nel",
      date: new Date("2026-09-19T19:00:00+02:00"),
      location: "Wapadrant Kerksaal, Sunriseweg 3, Olympus, Pretoria",
      imageUrl: "/images/riana-nel-konser-2026.jpg",
      isPublished: true,
    },
  })

  await prisma.ticketType.createMany({
    data: [
      {
        eventId: rianaNelKonser.id,
        name: "Volwassenes",
        price: 250.00,
        quantity: 300,
        sold: 0,
      },
      {
        eventId: rianaNelKonser.id,
        name: "Hoërskoolleerders",
        price: 150.00,
        quantity: 100,
        sold: 0,
      },
      {
        eventId: rianaNelKonser.id,
        name: "Laerskoolleerders",
        price: 50.00,
        quantity: 80,
        sold: 0,
      },
      {
        eventId: rianaNelKonser.id,
        name: "Worsbroodjies",
        price: 35.00,
        quantity: 200,
        sold: 0,
      },
    ],
  })
  console.log("✅ Riana Nel Konser event en kaartjies geskep")

  // Create Ticket Types for Jeugkonferensie
  await prisma.ticketType.createMany({
    data: [
      {
        eventId: jeugkonferensie.id,
        name: "Volwassene",
        price: 150.00,
        quantity: 200,
        sold: 0,
      },
      {
        eventId: jeugkonferensie.id,
        name: "Skolier",
        price: 75.00,
        quantity: 100,
        sold: 0,
      },
      {
        eventId: jeugkonferensie.id,
        name: "Kind (onder 12)",
        price: 0.00,
        quantity: 50,
        sold: 0,
      },
    ],
  })
  console.log("✅ Ticket tipes geskep")

  // Create Sermons
  const sermon1 = await prisma.sermon.create({
    data: {
      title: "God se getrouheid",
      speaker: "Ds. Johan Buys",
      date: new Date("2026-08-03T10:00:00+02:00"),
      videoUrl: "https://youtube.com/watch?v=example1",
      audioUrl: "",
      series: "",
      description: "",
    },
  })

  const sermon2 = await prisma.sermon.create({
    data: {
      title: "Romeine: Genade vir elke dag",
      speaker: "Ds. Pieter Coetzee",
      date: new Date("2026-07-27T10:00:00+02:00"),
      videoUrl: "https://youtube.com/watch?v=example2",
      audioUrl: "",
      series: "Romeine",
      description: "",
    },
  })

  const sermon3 = await prisma.sermon.create({
    data: {
      title: "Lewe in die Gees",
      speaker: "Ds. Johan Buys",
      date: new Date("2026-07-20T10:00:00+02:00"),
      videoUrl: "https://youtube.com/watch?v=example3",
      audioUrl: "",
      series: "Romeine",
      description: "",
    },
  })
  console.log("✅ Preke geskep")

  // Create Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: "Welkom by Wapadrant!",
        content: "Ons is bly om jou by ons familie te verwelkom. Almal is welkom by ons familie! God vat jou soos jy is, maar Hy los jou nooit soos jy is nie.",
        type: "general",
      },
      {
        title: "Jeugkamp aansluiting",
        content: "Skryf nou in vir die jeugkamp. Kontak die jeugkantoor vir meer inligting.",
        type: "general",
      },
      {
        title: "Verjaarsdae Augustus",
        content: "Ons vier verjaarsdae in Augustus. Kontak die kerkkantoor vir die volledige lys.",
        type: "birthday",
      },
    ],
  })
  console.log("✅ Aankondigings geskep")

  // Create Settings
  const settings = [
    { key: "church_name", value: "Wapadrant Gemeente" },
    { key: "church_address", value: "Sunrise Road 3, Olympus, Pretoria" },
    { key: "church_phone", value: "012 991-1395" },
    { key: "church_whatsapp", value: "064 181 0694" },
    { key: "church_email", value: "kantoor@gkwapadrant.co.za" },
    { key: "service_times", value: "08:30 Jeuggroepe, 10:00 Klassiek" },
    { key: "facebook_url", value: "gkwapadrant" },
    { key: "youtube_url", value: "6mloVeZC2g" },
  ]

  await prisma.setting.createMany({
    data: settings,
  })
  console.log("✅ Instellings geskep")

  // Create sample contact messages
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Jan van der Merwe",
        email: "jan@example.com",
        phone: "082 123 4567",
        subject: "Vra oor doop",
        message: "Goeiemôre, ek wil graag meer weet oor die doop.",
        type: "general",
        status: "new",
      },
      {
        name: "Maria Smit",
        email: "maria@example.com",
        phone: "071 987 6543",
        subject: "Gebed versoek",
        message: "Bid asseblief vir my siek ma.",
        type: "prayer",
        status: "read",
      },
    ],
  })
  console.log("✅ Kontak boodskappe geskep")

  console.log("🎉 Seed data voltooi!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
