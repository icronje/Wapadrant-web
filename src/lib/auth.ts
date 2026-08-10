import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { prisma } from './prisma'
import { verifyPassword } from './password'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Gebruikersnaam', type: 'text' },
        password: { label: 'Wagwoord', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Gebruikersnaam en wagwoord vereis')
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        })

        if (!user) {
          throw new Error('Ongeldige gebruikersnaam of wagwoord')
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          throw new Error('Ongeldige gebruikersnaam of wagwoord')
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
})
