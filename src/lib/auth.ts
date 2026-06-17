import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await db.user.findUnique({ where: { email: credentials.email }, include: { company: true } })
        if (!user || !user.isActive) return null
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null
        await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
        return { id: user.id, email: user.email, name: user.fullName || user.username, role: user.role, companyId: user.companyId }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = (user as any).role; token.companyId = (user as any).companyId }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
        (session.user as any).role = token.role
        (session.user as any).companyId = token.companyId
      }
      return session
    },
  },
  pages: { signIn: '/' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}
