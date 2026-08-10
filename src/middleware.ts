import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') && 
    !req.nextUrl.pathname.startsWith('/admin/login')
  
  if (isAdminRoute && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
})

export const config = {
  matcher: ['/admin/((?!login).*)']
}
