import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { verifyPassword } from "./password"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Gebruikersnaam", type: "text" },
        password: { label: "Wagwoord", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Gebruikersnaam en wagwoord vereis")
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        })

        if (!user) {
          throw new Error("Ongeldige gebruikersnaam of wagwoord")
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          throw new Error("Ongeldige gebruikersnaam of wagwoord")
        }

        return {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as any).username
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).username = token.username
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
