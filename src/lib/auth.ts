import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user || !user.isActive) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.fullName || user.username,
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // إضافة الدور و companyId للـ token
        const dbUser = await db.user.findUnique({
          where: { id: (user as any).id },
          select: { role: true, companyId: true, fullName: true, username: true },
        })
        if (dbUser) {
          token.name = dbUser.fullName || dbUser.username
          ;(token as any).role = dbUser.role
          ;(token as any).companyId = dbUser.companyId
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.sub
        ;(session.user as any).role = (token as any).role
        ;(session.user as any).companyId = (token as any).companyId
      }
      return session
    },
  },
  // لا حاجة لصفحة signIn — نستخدم mock user
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}
