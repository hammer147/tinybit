import { NextRequest, NextResponse } from 'next/server'
import { redis } from '../lib/redis'

export async function middleware(req: NextRequest) {

  // if req is for homepage or /manage or /api/ or /favicon then do nothing
  // else check short url in redis and redirect
  // console.log('pathname: ', req.nextUrl.pathname)


  if (req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname.startsWith('/manage') ||
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const shortUrl = req.nextUrl.pathname.split('/').slice(-1)[0]
  const longUrl = await redis.hget('links', shortUrl)

  if (longUrl) return NextResponse.redirect(longUrl as string)
  return NextResponse.redirect(req.nextUrl.origin)
}
